import {api} from "../../config/api";
import * as Cookies from "../../helpers/cookies";
api.defaults.headers.common = {Authorization: `Bearer ${Cookies.accessToken}`};

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

export const getProfileApi = (payload: string) => {
  return api.get(`/users/${payload || ""}`);
};

export const editProfileApi = (payload: FormData) => {
  return api.put(`/users/edit`, payload);
};
