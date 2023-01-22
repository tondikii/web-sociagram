import * as CONST from "../constant";
import {signInApi, signUpApi} from "../api";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {deleteCookie} from "cookies-next";

export const signUp = createAsyncThunk(
  CONST.SIGN_UP,
  async (
    payload: {username: string; email: string; password: string},
    {rejectWithValue}
  ) => {
    try {
      const response = await signUpApi(payload);
      return response;
    } catch (err) {
      const messageError = err?.response?.data?.error;
      return rejectWithValue(messageError);
    }
  }
);

export const signIn = createAsyncThunk(
  CONST.SIGN_IN,
  async (payload: {email: string; password: string}, {rejectWithValue}) => {
    try {
      const response = await signInApi(payload);
      return response;
    } catch (err) {
      const messageError = err?.response?.data?.error;
      return rejectWithValue(messageError);
    }
  }
);

export const signOut = createAsyncThunk(CONST.SIGN_OUT, async () => {
  deleteCookie("accessToken");
  return true;
});
