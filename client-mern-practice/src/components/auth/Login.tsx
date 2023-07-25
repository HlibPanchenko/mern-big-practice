import React from "react";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { loginAction } from "../../redux/slices/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./auth.scss";
import { useAppDispatch } from "../../redux/hooks";

type UserSubmitForm = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const [emailErorr, setEmailError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<UserSubmitForm>({ mode: "onChange" });

  // const previousEmail = watch('email'); // Получение предыдущего значения поля "email"

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // функция отправки данных на сервер
  const LoginHandler = async (obj: UserSubmitForm) => {
    try {
      const response = await axios.post(
        "http://localhost:4444/auth/login",
        obj
      );
      setEmailError("");
      // setDataForm(obj);
      const { email, password, name, avatar, _id,__v, likedposts } = response.data;
      const user = { email, password, name, avatar, _id,__v, likedposts };

      dispatch(loginAction(user));
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      reset();
      navigate("/");
    } catch (error: any) {
      // console.log(error);
      console.log(error.response?.data?.message);
      // console.log(error?.response.data.errors.errors[0].msg);
      // const customEmailError = error?.response.data.errors.errors[0].msg;
      // setEmailError(customEmailError);
      setEmailError(error.response?.data?.message);
    }
  };

  const onSubmit: SubmitHandler<UserSubmitForm> = async (data) => {
    LoginHandler(data);
  };

  return (
    <div className="container-auth">
      {emailErorr && <div className="emailError-auth"> {emailErorr}</div>}

      <form className="formAuth-auth" onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="email"
          {...register("email", {
            required: true,
          })}
          // defaultValue={previousEmail} // Установка значения по умолчанию
        />
        {errors.email && <span>Email is required</span>}

        <input
          placeholder="password"
          {...register("password", {
            required: true,
            minLength: {
              value: 5,
              message: "Пароль должен состоять минимум из 5 символов",
            },
          })}
        />
        {errors.password && (
          <span>{errors.password.message || "Password is required"}</span>
        )}

        <input type="submit" value="Log in" disabled={!isValid} />
      </form>
    </div>
  );
};

export default Login;
