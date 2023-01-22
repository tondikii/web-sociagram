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
