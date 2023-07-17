import React, { useState, ChangeEvent, useRef } from "react";
import axios from "axios";
import "./profileIcon.scss";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setUser } from "../../redux/slices/authSlice";
import { API_URL } from "../../config.js";

interface ProfileIconProps {
  size: "small" | "large";
}

const ProfileIcon: React.FC<ProfileIconProps> = ({ size }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const [uploadMessage, setUploadMessage] = useState<string>("");
  const [isAvatar, setIsAvatar] = useState(false);
  const disptach = useAppDispatch();
  const userInfo = useAppSelector((state) => state.auth);
  console.log(userInfo);

  const avatar = userInfo?.user?.avatar
    ? `${API_URL + userInfo?.user?._id + "/" + userInfo.user.avatar}`
    : "/images/user.png";
  // const avatar = userInfo.user.avatar ? userInfo.user.avatar : "/images/user.png";
  // const avatar = isAvatar ? "answer from server" : "/images/user.png";

  const myElementRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (selectedFile) {
      handleFileUpload();
    }
  }, [selectedFile]);

  const handleFileUpload = async () => {
    if (!selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append("avatar", selectedFile);

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.post(
          "http://localhost:4444/file/uploadfile",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.user);

        setIsAvatar(true);
        disptach(setUser(response.data.user));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };


   // определение классов в зависимости от размера
   const containerClassName = `profile-icon ${size === "large" ? "large" : ""}`;
   const imgClassName = `profile-icon__img ${size === "large" ? "large" : ""}`;

  return (
    <div
      // className="profile-icon containerClassName"
      className={containerClassName}
      onClick={() => myElementRef?.current?.click()}
    >
      <img
        // src="/images/user.png"
        className={imgClassName}
        src={avatar}
        alt="Profile Icon"
      />
      <input
        ref={myElementRef}
        className="profile-icon__input"
        type="file"
        name="avatar"
        id="profile-photo"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ProfileIcon;
