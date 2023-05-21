import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { loginAction } from "../../redux/slices/authSlice.js";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import styles from "./auth.module.scss";

const Login = () => {
  const [emailErorr, setEmailError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // функция отправки данных на сервер
  const LoginHandler = async (obj) => {
    try {
      const response = await axios.post(
        "http://localhost:4444/auth/login",
        obj
      );
      setEmailError("");
      // setDataForm(obj);
      const { email, password } = response.data;
      const user = { email, password };

      dispatch(loginAction(user));

      reset();
      navigate("/");
    } catch (error) {
      // console.log(error);
      console.log(error.response.data.message);
      // console.log(error?.response.data.errors.errors[0].msg);
      // const customEmailError = error?.response.data.errors.errors[0].msg;
      // setEmailError(customEmailError);
      setEmailError(error.response.data.message);
    }
  };

  const onSubmit = async (data) => {
    LoginHandler(data);
  };

  return (
    <div className={styles.container}>
      {emailErorr && <div className={styles.emailError}> {emailErorr}</div>}

      <form className={styles.formAuth} onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="email"
          {...register("email", {
            required: true,
          })}
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
