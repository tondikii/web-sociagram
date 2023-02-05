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
  return api.put(`/users/edit`, payload?.data);
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
