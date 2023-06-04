import * as CONST from "../constant";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {deleteCookie} from "cookies-next";
import {getPostsApi} from "../api";

export const signOut = createAsyncThunk(CONST.SIGN_OUT, async () => {
  deleteCookie("accessToken");
  localStorage.clear();
  return true;
});

export const getPosts = createAsyncThunk(
  CONST.GET_POSTS,
  async (
    payload: {
      accessToken: string;
    },
    {rejectWithValue}
  ) => {
    try {
      const {data} = await getPostsApi(payload);
      return data?.data;
    } catch (err: any) {
      const messageError =
        err?.response?.data?.error || "Failed fetching posts!";
      return rejectWithValue(messageError);
    }
  }
);
