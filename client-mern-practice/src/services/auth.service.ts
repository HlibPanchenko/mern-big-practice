import axios, { AxiosResponse } from "axios";
import $api from "../http";
import { AuthResponse } from "../models/reponse/AuthResponse";

type LoginSubmitForm = {
  email: string;
  password: string;
};

type RegisterSubmitForm = {
  email: string;
  password: string;
  name: string;
};

export default class authService {
  static async LoginHandler(
    obj: LoginSubmitForm
  ): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>("/auth/login", obj);
  }
  static async RegistrationService(
    obj: RegisterSubmitForm
  ): Promise<AxiosResponse<AuthResponse>> {
    return $api.post("/auth/registration", obj);
  }
  static async LogOutHandler(): Promise<void> {
    return $api.post("/auth/logout");
  }
}
