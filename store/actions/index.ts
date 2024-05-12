import * as CONST from "../constant";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {deleteCookie} from "cookies-next";
import {getPostsApi, getPostsLikedApi} from "../api";

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
      return [];
      // return data?.data;
    } catch (err: any) {
      const messageError =
        err?.response?.data?.error || "Failed fetching posts!";
      return rejectWithValue(messageError);
    }
  }
);

export const getPostsLiked = createAsyncThunk(
  CONST.GET_POSTS_LIKED,
  async (
    payload: {
      accessToken: string;
    },
    {rejectWithValue}
  ) => {
    try {
      const {data} = await getPostsLikedApi(payload);
      const mappedData = data?.data.map((e: any) => e?.Post);
      return mappedData;
    } catch (err: any) {
      const messageError =
        err?.response?.data?.error || "Failed fetching posts liked!";
      return rejectWithValue(messageError);
    }
  }
);
