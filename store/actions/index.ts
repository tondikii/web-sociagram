import * as CONST from "../constant";
import {
  getProfileApi,
  editProfileApi,
  getPostsLikedApi,
  createPostsApi,
  likeUnLikeApi,
  getPostCommentsApi,
  createPostCommentApi,
} from "../api";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {deleteCookie} from "cookies-next";

export const signOut = createAsyncThunk(CONST.SIGN_OUT, async () => {
  deleteCookie("accessToken");
  localStorage.clear();
  return true;
});

export const getProfile = createAsyncThunk(
  CONST.GET_PROFILE,
  async (payload: {accessToken: string; data: string}, {rejectWithValue}) => {
    try {
      const response = await getProfileApi(payload);
      return response;
    } catch (err) {
      const messageError = err?.response?.data?.error;
      return rejectWithValue(messageError);
    }
  }
);

export const editProfile = createAsyncThunk(
  CONST.EDIT_PROFILE,
  async (
    payload: {
      accessToken: string;
      data: FormData;
    },
    {rejectWithValue}
  ) => {
    try {
      const response = await editProfileApi(payload);
      return response;
    } catch (err) {
      const messageError = err?.response?.data?.error;
      return rejectWithValue(messageError);
    }
  }
);

export const getPostsLiked = createAsyncThunk(
  CONST.GET_POSTS_LIKED,
  async (
    payload: {
      accessToken: string;
      data: string;
    },
    {rejectWithValue}
  ) => {
    try {
      const response = await getPostsLikedApi(payload);
      return response;
    } catch (err) {
      const messageError = err?.response?.data?.error;
      return rejectWithValue(messageError);
    }
  }
);

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

export const getPostComments = createAsyncThunk(
  CONST.GET_POST_COMMENTS,
  async (
    payload: {
      accessToken: string;
      data: number;
    },
    {rejectWithValue}
  ) => {
    try {
      const response = await getPostCommentsApi(payload);
      return response;
    } catch (err) {
      const messageError = err?.response?.data?.error;
      return rejectWithValue(messageError);
    }
  }
);

export const createPostComment = createAsyncThunk(
  CONST.CREATE_POST_COMMENTS,
  async (
    payload: {
      accessToken: string;
      data: {PostId: number; comment: string};
    },
    {rejectWithValue}
  ) => {
    try {
      const response = await createPostCommentApi(payload);
      return response;
    } catch (err) {
      const messageError = err?.response?.data?.error;
      return rejectWithValue(messageError);
    }
  }
);
