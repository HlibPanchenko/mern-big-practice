import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import "./PostForm.scss";
import { useNavigate } from "react-router-dom";
import { BsCloudDownload } from "react-icons/bs";
const PostForm = () => {
  const [titlePost, settitlePost] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  // console.log(images);

  const [titleError, setTitleError] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [step, setStep] = React.useState(0);
  const [currentImg, setCurrentImg] = React.useState(null);
  // Add state to keep track of the current index of the dragged image
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(
    null
  );
  const token = localStorage.getItem("token");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  // сheck for empty input
  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    settitlePost(value);

    // Set the error status based on whether the input is empty or not
    setTitleError(value.trim() === "");
  };

  // Update the button click handler in step 1 to check for input error
  const handleStep1Next = () => {
    if (titlePost.trim() === "") {
      setTitleError(true);
    } else {
      setTitleError(false);
      setStep(2);
    }
  };

  const handleStep2Next = () => {
    if (!images || images.length === 0) {
      setImageError(true);
    } else {
      setImageError(false);
      setStep(3);
    }
  };

  // Function to open the file input dialog when clicking on the drop zone
  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   settitlePost(event.target.value);
  // };

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      // setImages( Array.from(event.target.files));
      setImages(event.target.files);
    }
  };

  const handleSubmit = async () => {
    // event.preventDefault();

    const formData = new FormData();
    formData.append("text", titlePost);
    formData.append("description", description);
    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append("images[]", images[i]);
      }
    }
    console.log(formData);

    try {
      const response = await axios.post(
        "http://localhost:4444/post/create",
        formData,
        {
          headers: {
            // "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Обработка успешного создания поста
      console.log(response.data);
      // Сброс формы после успешного создания поста
      settitlePost("");
      setDescription("");
      setImages(null);
      navigate("/myprofile");
    } catch (error) {
      // Обработка ошибки создания поста
      console.error(error);
    }
  };

  // Handle the drop event for drag and drop functionality
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const dataTransfer = event.dataTransfer;
    if (dataTransfer.items) {
      const files = dataTransfer.files;
      setImages(files);
    }
  };

  // Handle the drag over event to allow dropping
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // Handle the paste event to get files from clipboard
  const handlePaste = (event: ClipboardEvent) => {
    const files = event.clipboardData?.files;
    if (files) {
      setImages(files);
    }
  };

  // Add event listeners for drag and drop and paste
  React.useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  // drag images logic

  const dragStartHandler = (
    e: React.DragEvent<HTMLDivElement>,
    image: any,
    index: number
  ) => {
    console.log("drag", image, index);
    setCurrentImg(image);
    setDraggedImageIndex(index);
  };

  const dropHandler = (
    e: React.DragEvent<HTMLDivElement>,
    image: any,
    index: number
  ) => {
    e.preventDefault();
    console.log("drop", image, index);
    if (draggedImageIndex !== null) {
      // Create a copy of the images array to avoid direct mutation
      const imagesCopy = Array.from(images || []);

      // Remove the dragged image from the images array
      const [draggedImage] = imagesCopy.splice(draggedImageIndex, 1);

      // Insert the dragged image at the dropped index
      imagesCopy.splice(index, 0, draggedImage);

      // Create a new DataTransfer object
      const dataTransfer = new DataTransfer();

      // Set the reordered files in the DataTransfer object
      imagesCopy.forEach((file) => {
        dataTransfer.items.add(file);
      });

      // Update the state with the reordered FileList
      const reorderedFileList = dataTransfer.files;
      setImages(reorderedFileList);
    }
  };

  const dragOverHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <>
      {step === 0 && (
        <div className="postformzero zeropost">
          <h2 className="postformzero-title zeropost-title">
            Привет, здесь ты можешь опубликовать информацию о своей
            коллекционной машинке всего в несколько кликов!
          </h2>
          <div className="postformzero-btn zeropost-btn" onClick={() => setStep(1)}>
            Перейти к созданию...
          </div>
        </div>
      )}
      {step === 1 && (
        <div className="postformzero">
          <div className="postformzero-content" data-type="title">
            <h2 className="postformzero-title">
              Шаг: {step} <br />
              Придумайте название для своего поста
            </h2>
            <div className="postformzero-input">
              <input
                type="text"
                id="text"
                value={titlePost}
                onChange={handleTextChange}
                style={{ borderColor: titleError ? "red" : "initial" }}
              />
              {titleError && (
                <p style={{ color: "red" }}>Please enter a title.</p>
              )}
            </div>
          </div>
          <div className="postformzero-btn">
            <div className="postformzero-btn-back" onClick={() => setStep(0)}>
              Вернуться назад...
            </div>
            <div className="postformzero-btn-next" onClick={handleStep1Next}>
              Следующий шаг...
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div
          className="postformzero"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <h2 className="postformzero-title">
            Шаг: {step} <br />
            Добавьте фотографии модели Hot Wheels
          </h2>
          <input
            className="postformzero-inputImg"
            type="file"
            id="images"
            ref={fileInputRef}
            accept="image/*"
            multiple
            onChange={handleImageChange}
            style={{ borderColor: imageError ? "red" : "initial" }}
          />
          {imageError && (
            <p style={{ color: "red" }}>Please upload at least one image.</p>
          )}
          <div className="image-drop-zone" onClick={openFileInput}>
            <p>Choose a file or drag it here</p>
            <BsCloudDownload className="image-drop-zone-icon" />
            <div className="image-preview">
              {images &&
                Array.from(images).map((image, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt={`Image ${index + 1}`}
                  />
                ))}
            </div>
          </div>

          <div className="postformzero-btn">
            <div className="postformzero-btn-back" onClick={() => setStep(1)}>
              Вернуться назад...
            </div>
            <div className="postformzero-btn-next" onClick={handleStep2Next}>
              Следующий шаг...
            </div>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="postformzero">
          <div className="postformzero-content" data-type="description">
            <h2 className="postformzero-title">
              Шаг: {step} <br />
              Добавьте описание модели Hot Wheels
            </h2>
            <div className="postformzero-input" data-input="description">
              {/* <label htmlFor="description">Описание модели:</label> */}
              <textarea
                id="description"
                value={description}
                placeholder="Write here your description..."
                onChange={handleDescriptionChange}
              />
              {/* <textarea
                id="description"
                value={description}
                onChange={handleDescriptionChange}
              /> */}
            </div>
          </div>
          <div className="postformzero-btn">
            <div className="postformzero-btn-back" onClick={() => setStep(2)}>
              Вернуться назад...
            </div>
            <div className="postformzero-btn-next" onClick={() => setStep(4)}>
              Следующий шаг...
            </div>
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="postformzero preview">
          <h2 className="preview-title">Предпросмотр публикации</h2>
          <div className="preview-article">
            <h3 className="preview-posttitle">Модель: {titlePost}</h3>
            <p className="preview-description">Описание: {description}</p>
            <div className="preview-gallery">
              {images &&
                Array.from(images).map((image, index) => (
                  <div
                    key={index}
                    className={`image-container ${
                      index === 0 ? "main-image" : ""
                    }`}
                  >
                    {/* {index === 0 && (
                      <p className="main-image-label">Main image</p>
                    )} */}
                    <img
                      draggable={true}
                      onDragStart={(e) => dragStartHandler(e, image, index)}
                      // onDragLeave={(e)=> dragEndHandler(e)}
                      // onDragEnd={  (e)=>dragEndHandler(e)}
                      onDragOver={(e) => dragOverHandler(e)}
                      onDrop={(e) => dropHandler(e, image, index)}
                      key={index}
                      src={URL.createObjectURL(image)}
                      alt={`Image ${index + 1}`}
                    />
                  </div>
                ))}
            </div>
          </div>
            <div className="preview-btn">
              <div
                className="postformzero-btn-back "
                onClick={() => setStep(3)}
              >
                Вернуться назад...
              </div>
              <button onClick={handleSubmit}>Опубликовать</button>
            </div>
        </div>
      )}
    </>
  );
};

export default PostForm;
