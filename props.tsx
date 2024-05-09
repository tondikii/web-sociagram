export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  name: string;
  bio: string;
  gender: string;
}

export interface Session {
  accessToken: string;
  id: number;
  username: string;
  avatar: string;
}

export interface PostCommentUser {
  id: number;
  username: string;
  avatar: string;
}

export interface PostComment {
  id: number;
  comment: string;
  User: PostCommentUser;
}

export interface PostLike {
  id: number;
  PostId: number;
  UserId: number;
}

export interface Post {
  id: number;
  files: string[];
  caption: string;
  UserId: number;
  User: User;
  createdAt: string;
  PostComments: PostComment[];
  PostLikes: PostLike[];
}

export interface Profile {
  id: number;
  username: string;
  email: string;
  avatar: string;
  name: string;
  bio: string;
  gender: string;
  followers: number[];
  following: number[];
  Posts: Post[];
}

export interface Posts {
  fetch: boolean;
  data: Post[];
  error: string;
}

export interface Message {
  UserId: number;
  User?: User;
  UserIdReceiver: number;
  message: string;
}
