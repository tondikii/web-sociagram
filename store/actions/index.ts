import * as CONST from "../constant";
import {createPostsApi, likeUnLikeApi} from "../api";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {deleteCookie} from "cookies-next";

export const signOut = createAsyncThunk(CONST.SIGN_OUT, async () => {
  deleteCookie("accessToken");
  localStorage.clear();
  return true;
});

export const createPosts = createAsyncThunk(
  CONST.CREATE_POST,
  async (
    payload: {
      accessToken: string;
      data: {caption: string; files: string[]};
    },
    {rejectWithValue}
  ) => {
    try {
      const response = await createPostsApi(payload);
      return response;
    } catch (err) {
      const messageError = err?.response?.data?.error;
      return rejectWithValue(messageError);
    }
  }
);

export const likeUnLike = createAsyncThunk(
  CONST.LIKE_POST,
  async (
    payload: {
      accessToken: string;
      data: {postId: string};
    },
    {rejectWithValue}
  ) => {
    try {
      const response = await likeUnLikeApi(payload);
      return response;
    } catch (err) {
      const messageError = err?.response?.data?.error;
      return rejectWithValue(messageError);
    }
  }
);
