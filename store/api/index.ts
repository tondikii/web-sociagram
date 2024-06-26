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

export const getProfileApi = (payload: {
  accessToken: string;
  data: string | null;
}) => {
  api.defaults.headers.common = {
    Authorization: `Bearer ${payload?.accessToken}`,
  };
  return api.get(`/users/${payload?.data || ""}`);
};

export const editProfileApi = (payload: {
  accessToken: string;
  data: FormData;
  signal: AbortSignal;
}) => {
  const {accessToken, data, signal} = payload || {};
  api.defaults.headers.common = {
    Authorization: `Bearer ${accessToken}`,
  };
  return api.put("/users/edit", data, {signal});
};

export const searchUsersApi = (payload: {
  accessToken: string;
  data: string;
  signal: AbortSignal;
}) => {
  const {accessToken, data, signal} = payload || {};
  api.defaults.headers.common = {
    Authorization: `Bearer ${accessToken}`,
  };
  return api.get(`users/find?search=${data || ""}`, {signal});
};

export const followUnfollowApi = (payload: {
  accessToken: string;
  data: {id: number};
}) => {
  api.defaults.headers.common = {
    Authorization: `Bearer ${payload?.accessToken}`,
  };
  return api.put("/users/follow", payload?.data);
};

export const getFollowersFollowingApi = (payload: {
  accessToken: string;
  menu: string;
  id: number;
  signal: AbortSignal;
}) => {
  const {accessToken, menu, id, signal} = payload || {};
  api.defaults.headers.common = {
    Authorization: `Bearer ${accessToken}`,
  };
  return api.get(`users/${menu}/${id}`, {signal});
};

export const getPostsApi = (payload: {accessToken: string}) => {
  api.defaults.headers.common = {
    Authorization: `Bearer ${payload?.accessToken}`,
  };
  return api.get(`posts`);
};

export const getPostsLikedApi = (payload: {accessToken: string}) => {
  api.defaults.headers.common = {
    Authorization: `Bearer ${payload?.accessToken}`,
  };
  return api.get("posts/likes");
};

export const createPostApi = (payload: {
  accessToken: string;
  data: {caption: string; files: string[]};
  signal: AbortSignal;
}) => {
  const {accessToken, data, signal} = payload || {};
  api.defaults.headers.common = {
    Authorization: `Bearer ${accessToken}`,
  };
  return api.post("/posts/create", data, {signal});
};

export const likeUnLikeApi = (payload: {
  accessToken: string;
  data: {PostId: number};
  signal?: AbortSignal;
}) => {
  const {accessToken, data, signal} = payload || {};
  const headers = {signal};
  if (!headers.signal) {
    delete headers.signal;
  }
  api.defaults.headers.common = {
    Authorization: `Bearer ${accessToken}`,
  };
  return api.put("/posts/like", data, headers);
};

export const getPostCommentsApi = (payload: {
  accessToken: string;
  data: number;
  signal: AbortSignal;
}) => {
  const {accessToken, data, signal} = payload || {};
  api.defaults.headers.common = {
    Authorization: `Bearer ${accessToken}`,
  };
  return api.get(`postComments/${data || 0}`, {signal});
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

export const fetchChatApi = (payload: {
  accessToken: string;
  data: number;
  signal: AbortSignal;
}) => {
  const {accessToken, signal} = payload || {};
  api.defaults.headers.common = {
    Authorization: `Bearer ${accessToken}`,
  };
  return api.get("userChats", {signal});
};
