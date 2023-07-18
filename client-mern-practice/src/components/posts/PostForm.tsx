import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import "./PostForm.scss";

const PostForm = () => {
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<FileList | null>(null);

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  // const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files && event.target.files.length > 0) {
  //     setImages(event.target.files);
  //   }
  // };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImages(event.target.files);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("text", text);
    formData.append("description", description);
    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
    }

    try {
      const response = await axios.post("/api/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Обработка успешного создания поста
      console.log(response.data);
      // Сброс формы после успешного создания поста
      setText("");
      setDescription("");
      setImages(null);
    } catch (error) {
      // Обработка ошибки создания поста
      console.error(error);
    }
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="text">Название модели:</label>
        <input type="text" id="text" value={text} onChange={handleTextChange} />
      </div>
      <div>
        <label htmlFor="description">Описание модели:</label>
        <textarea
          id="description"
          value={description}
          onChange={handleDescriptionChange}
        />
      </div>
      <div>
        <label htmlFor="images">Изображения:</label>
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
      <button type="submit">Создать пост</button>
    </form>
  );
};

export default PostForm;
