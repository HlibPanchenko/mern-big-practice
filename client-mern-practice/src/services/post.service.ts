import axios, { AxiosResponse } from "axios";
import $api from "../http";
import { AuthResponse } from "../models/reponse/AuthResponse";

interface archivePostResponse {}

export default class postService {
  static async archivePostHandler(postId: string) {
    return $api.post(`/post/archivepost/${postId}`);
  }
}
