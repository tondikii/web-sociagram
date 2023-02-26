import {api} from "../../config/api";

export const signUpApi = (payload: {
  username: string;
  email: string;
  password: string;
}) => {
  return api.post("/users/signUp", payload);
};

export const signInApi = (payload: {email: string; password: string}) => {
  return api.post("/users/signIn", payload);
};

export const getProfileApi = (payload: {accessToken: string; data: string}) => {
  api.defaults.headers.common = {
    Authorization: `Bearer ${payload?.accessToken}`,
  };
  return api.get(`/users/${payload?.data || ""}`);
};

export const editProfileApi = (payload: {
  accessToken: string;
  data: FormData;
}) => {
  api.defaults.headers.common = {
    Authorization: `Bearer ${payload?.accessToken}`,
  };
  return api.put("/users/edit", payload?.data);
};

export const searchUsersApi = (payload: {
  accessToken: string;
  data: string;
}) => {
  api.defaults.headers.common = {
    Authorization: `Bearer ${payload?.accessToken}`,
  };
  return api.get(`users/find?search=${payload?.data || ""}`);
};

export const followUnfollowApi = (payload: {
  accessToken: string;
  data: {userId: string};
}) => {
  api.defaults.headers.common = {
    Authorization: `Bearer ${payload?.accessToken}`,
  };
  return api.put("/users/follow", payload?.data);
};

export const getFollowersFollowingApi = (payload: {
  accessToken: string;
  menu: string;
  username: string;
}) => {
  api.defaults.headers.common = {
    Authorization: `Bearer ${payload?.accessToken}`,
  };
  return api.get(`users/${payload?.menu}/${payload?.username}`);
};

export const getPostsApi = (payload: {accessToken: string; data: string}) => {
  api.defaults.headers.common = {
    Authorization: `Bearer ${payload?.accessToken}`,
  };
  return api.get(`posts?username=${payload?.data || ""}`);
};

export const getPostsLikedApi = (payload: {accessToken: string}) => {
  api.defaults.headers.common = {
    Authorization: `Bearer ${payload?.accessToken}`,
  };
  return api.get("posts/likes");
};

export const createPostsApi = (payload: {
  accessToken: string;
  data: {caption: string; files: string[]};
}) => {
  api.defaults.headers.common = {
    Authorization: `Bearer ${payload?.accessToken}`,
  };
  return api.post("/posts/create", payload?.data);
};

export const likeUnLikeApi = (payload: {
  accessToken: string;
  data: {postId: string};
}) => {
  api.defaults.headers.common = {
    Authorization: `Bearer ${payload?.accessToken}`,
  };
  return api.put("/posts/like", payload?.data);
};

export const getPostCommentsApi = (payload: {
  accessToken: string;
  data: number;
}) => {
  api.defaults.headers.common = {
    Authorization: `Bearer ${payload?.accessToken}`,
  };
  return api.get(`postComments/${payload?.data || 0}`);
};

export const createPostCommentApi = (payload: {
  accessToken: string;
  data: {PostId: number; comment: string};
}) => {
  api.defaults.headers.common = {
    Authorization: `Bearer ${payload?.accessToken}`,
  };
  return api.post("postComments", payload?.data || {});
};
