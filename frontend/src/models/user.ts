import Post from "./post";

export default interface User {
  username: string;
  email: string;
  _id: string;
  imageUrl?: string;
  posts?: Post[];
  accessToken?: string;
  refreshToken?: string;
}