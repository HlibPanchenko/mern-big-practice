import React from "react";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import "./auth.scss";

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
      reset();
    } catch (error) {
      console.log(error.response.data.errors.errors[0].msg);
      const customEmailError = error.response.data.errors.errors[0].msg;
      setEmailError(customEmailError);
    }
  };

  const onSubmit = async (data) => {
    console.log(data);
    registrationHandler(data);
    // reset();
  };

  console.log(watch("email")); // watch input value by passing the name of it

  return (
    <div className="container">
      {/*  */}
      {emailErorr && <div className="emailError"> {emailErorr}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
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
