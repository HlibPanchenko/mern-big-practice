import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { registerAction } from "../../redux/slices/authSlice.js";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./auth.module.scss";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const [dataForm, setDataForm] = useState({});
  const [emailErorr, setEmailError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const isAuth = useSelector((state) => state.auth.isAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // функция отправки данных на сервер
  const registrationHandler = async (obj) => {
    try {
      const response = await axios.post(
        "http://localhost:4444/auth/registration",
        obj
      );
      setEmailError("");
      setDataForm(obj);
      console.log(response);
      const { email, password } = response.data;
      const user = { email, password };

      dispatch(registerAction(user));
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      reset();
      navigate("/");
    } catch (error) {
      // console.log(error);
      // console.log(error.response.data.message);
      console.log(error?.response.data.errors.errors[0].msg);
      const customEmailError = error?.response.data.errors.errors[0].msg;
      setEmailError(customEmailError);
      // setEmailError(error.response.data.message);
    }
  };

  const onSubmit = async (data) => {
    registrationHandler(data);
  };
  // if (isAuth) {return <Navigate to='/'>}

  return (
    <div className={styles.container}>
      {/*  */}
      {emailErorr && <div className={styles.emailError}> {emailErorr}</div>}

      <form className={styles.formAuth} onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="email"
          {...register("email", {
            required: true,
          })}
        />
        {errors.email && <span>Email is required</span>}
        {/* {errors.email && (
            <span>{errors.email.message || "Email is required"}</span>
          )} */}
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
        {/* {errors.password && <span>Password is required</span>} */}
        <input type="submit" value="Create account" disabled={!isValid} />
      </form>
    </div>
  );
};

export default Registration;
