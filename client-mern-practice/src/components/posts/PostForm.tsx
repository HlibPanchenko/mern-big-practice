import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import "./PostForm.scss";
import { useNavigate } from "react-router-dom";

const PostForm = () => {
  const [titlePost, settitlePost] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [step, setStep] = React.useState(0);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    settitlePost(event.target.value);
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
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

  return (
    <>
      {step === 0 && (
        <div className="postformzero">
          <h2 className="postformzero-title">
            Привет, здесь ты можешь опубликовать информацию о своей
            коллекционной машинке всего в несколько кликов!
          </h2>
          <div className="postformzero-btn" onClick={() => setStep(1)}>
            Перейти к созданию...
          </div>
        </div>
      )}
      {step === 1 && (
        <div className="postformzero">
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
            />
          </div>
          <div className="postformzero-btn" onClick={() => setStep(2)}>
            Следующий шаг...
          </div>
          <div className="postformzero-back" onClick={() => setStep(0)}>
            Вернуться назад...
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="postformzero">
          <h2 className="postformzero-title">
            Шаг: {step} <br />
            Добавьте фотографии модели Hot Wheels
          </h2>
          <div>
            {/* <label htmlFor="images">Изображения:</label> */}
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </div>

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
          <div className="postformzero-btn" onClick={() => setStep(3)}>
            Следующий шаг...
          </div>
          <div className="postformzero-back" onClick={() => setStep(1)}>
            Вернуться назад...
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="postformzero">
          <h2 className="postformzero-title">
            Шаг: {step} <br />
            Добавьте описание модели Hot Wheels
          </h2>
          <div className="postformzero-input">
            {/* <label htmlFor="description">Описание модели:</label> */}
            <textarea
              id="description"
              value={description}
              onChange={handleDescriptionChange}
            />
          </div>
          <div className="postformzero-btn" onClick={() => setStep(4)}>
            Следующий шаг...
          </div>
          <div className="postformzero-back" onClick={() => setStep(2)}>
            Вернуться назад...
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
                  <img
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt={`Image ${index + 1}`}
                  />
                ))}
            </div>
          </div>

          <button onClick={handleSubmit}>Опубликовать</button>
          <div className="postformzero-back" onClick={() => setStep(3)}>
            Вернуться назад...
          </div>
        </div>
      )}
    </>

    // <form className="post-form" onSubmit={handleSubmit}>
    //   <div>
    //     <label htmlFor="text">Название модели:</label>
    //     <input type="text" id="text" value={text} onChange={handleTextChange} />
    //   </div>
    //   <div>
    //     <label htmlFor="description">Описание модели:</label>
    //     <textarea
    //       id="description"
    //       value={description}
    //       onChange={handleDescriptionChange}
    //     />
    //   </div>
    //   <div>
    //     <label htmlFor="images">Изображения:</label>
    //     <input
    //       type="file"
    //       id="images"
    //       accept="image/*"
    //       multiple
    //       onChange={handleImageChange}
    //     />
    //   </div>

    //   <div className="image-preview">
    //     {images &&
    //       Array.from(images).map((image, index) => (
    //         <img
    //           key={index}
    //           src={URL.createObjectURL(image)}
    //           alt={`Image ${index + 1}`}
    //         />
    //       ))}
    //   </div>
    //   <button type="submit">Создать пост</button>
    // </form>
  );
};

export default PostForm;
