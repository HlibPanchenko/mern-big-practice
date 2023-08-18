import React, { ChangeEvent, FormEvent, useState } from "react";
import "./recognitionPage.scss";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useAppSelector } from "../redux/hooks";
import { BsCloudDownload } from "react-icons/bs";
import { ThreeDots } from "react-loader-spinner";

const RecognitionPage: React.FC = () => {
  const [images, setImages] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [brandCar, setBrandCar] = useState("");

  const token = localStorage.getItem("token");
  // const user = useSelector((state) => state.auth.user);
  const user = useAppSelector((state) => state.auth.user);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    // event.preventDefault();
    event.stopPropagation();

    const formData = new FormData();
    if (images) {
      formData.append("imageForAi", images[0]);
    }

    console.log(formData);

    try {
      setIsLoading(true);
      setBrandCar('')
      const response = await axios.post(
        "http://localhost:4444/file/recognition",
        formData,
        {
          headers: {
            // "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsLoading(false);
      setBrandCar(response.data.title);
      // Обработка успешного создания поста
      console.log(response.data);
      // Сброс формы после успешного создания поста

      // setImages(null);
      // navigate("/myprofile");
    } catch (error) {
      // Обработка ошибки создания поста
      console.error(error);
    }
  };

  // Handle the drag over event to allow dropping
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handlePaste = (event: ClipboardEvent) => {
    const files = event.clipboardData?.files;
    if (files && files.length === 1) {
      setImages(files);
    } else {
      alert("You can upload only 1 photo");
    }
  };

  // Add event listeners for drag and drop and paste
  React.useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const dataTransfer = event.dataTransfer;
    if (dataTransfer.items) {
      const files = dataTransfer.files;
      if (files.length === 1) {
        setImages(files);
      } else {
        alert("You can upload only 1 photo");
      }
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      // setImages( Array.from(event.target.files));
      setImages(event.target.files);
    }
  };

  // Function to open the file input dialog when clicking on the drop zone
  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="recognition">
      <div className="recognition-container">
        <h2 className="recognition-title">
          AI will find all the neccesary information about your car for you!
        </h2>

        <h3 className="recognition-subtitle">How does it work?</h3>
        <p>
          1. Upload photo of car <br />
          2. Wait <br />
          3. Here you are. You get all information about car
        </p>
        <div className="recognition-uload uploader">
          <div
            className="uploader-box"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={openFileInput}
          >
            <input
              className="uploader-inputImg"
              type="file"
              id="images"
              ref={fileInputRef}
              accept="image/*"
              // multiple
              onChange={handleImageChange}
            />

            <div className="uploader-drop-zone">
              {!images && (
                <>
                  <p>Choose one image or drag it here</p>
                  <BsCloudDownload className="uploader-drop-zone-icon" />
                </>
              )}

                {images &&
              <div className="uploader-image-preview">
                  {Array.from(images).map((image, index) => (
                    <>
                      <div className="uploader-image-content">
                        <img
                          key={index}
                          src={URL.createObjectURL(image)}
                          alt={`Image ${index + 1}`}
                        />

                        <button className="uploader-btn" onClick={handleSubmit}>
                          process Ai
                        </button>
                      </div>
                    </>
                  ))}
              </div>}
            </div>
          </div>
          <div className="uploader-result">
            {!isLoading && <p> Ai result: </p>}
            {brandCar && (
              <div className="uploader-nameOfcar"> {brandCar}</div>
            )}
            {isLoading && (
              <ThreeDots
                height="80"
                width="80"
                radius="9"
                color="#4fa94d"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                // wrapperClassName=""
                visible={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecognitionPage;
