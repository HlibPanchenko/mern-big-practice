import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { registerAction } from "../../redux/slices/authSlice";
import axios from "axios";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import "./auth.scss";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import authService from "../../services/auth.service";

type UserSubmitForm = {
  email: string;
  password: string;
  name: string;
};

const Registration: React.FC = () => {
  const [dataForm, setDataForm] = useState({});
  const [activateMail, setActivateMail] = useState(false);
  const [emailErorr, setEmailError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<UserSubmitForm>({ mode: "onChange" });

  const isAuth = useAppSelector((state) => state.auth.isAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // функция отправки данных на сервер
  const registrationHandler = async (obj: UserSubmitForm) => {
    try {
      setActivateMail(false);

      // const response = await axios.post(
      //   "http://localhost:4444/auth/registration",
      //   obj
      // );
      const response = await authService.RegistrationService(obj);

      setEmailError("");
      setDataForm(obj);
      console.log(response);
      const { user, refreshToken, token } = response.data;
      console.log(response.data);

      // const { email, password, name, _id, avatar, __v, likedposts, roles } = response.data;
      // const user = { email, password, name, avatar, _id, __v, likedposts, roles };

      dispatch(registerAction(user));
      if (token) {
        localStorage.setItem("token", token);
      }
      setActivateMail(true);
      reset();
      // navigate("/");
    } catch (error: any) {
      console.log(error);
      // console.log(error.response.data.message);
      // console.log(error.response?.data?.errors.errors[0].msg);
      // const customEmailError = error.response?.data?.errors.errors[0].msg;
      // setEmailError(customEmailError);
      // setEmailError(error.response.data.message);
    }
  };

  const onSubmit: SubmitHandler<UserSubmitForm> = async (data) => {
    registrationHandler(data);
  };
  // if (isAuth) {return <Navigate to='/'>}

  return (
    <div className="container-auth ">
      {/*  */}
      {emailErorr && <div className="emailError-auth"> {emailErorr}</div>}
      {!activateMail && (
        <form className="formAuth-auth" onSubmit={handleSubmit(onSubmit)}>
          <input
            placeholder="name"
            {...register("name", {
              required: true,
            })}
          />
          {errors.email && <span>Email is required</span>}
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
      )}
      {activateMail && (
        <div className="register-activate">
          <p style={{ color: "red" }}>
            {" "}
            We have send a message to your email. <br /> You need to submit your
            account in order to avoid fake mails.
          </p>
        </div>
      )}
    </div>
  );
};

export default Registration;
