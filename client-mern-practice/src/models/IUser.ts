export interface IUser {
  email: string;
  name: string;
  avatar: string;
  _id: string;
  __v: number;
  likedposts: string[];
  roles: string[];
  isActivated: boolean;
  activationLink: string;
}
