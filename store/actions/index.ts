import * as CONST from "../constant";
import {
  signInApi,
  signUpApi,
  getProfileApi,
  editProfileApi,
  searchUsersApi,
  followUnfollowApi,
  getFollowersFollowingApi,
  getPostsApi,
  getPostsLikedApi,
  createPostsApi,
  likeUnLikeApi,
  getPostCommentsApi,
  createPostCommentApi,
} from "../api";
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

export const searchUsers = createAsyncThunk(
  CONST.SEARCH_USERS,
  async (
    payload: {
      accessToken: string;
      data: string;
    },
    {rejectWithValue}
  ) => {
    try {
      const response = await searchUsersApi(payload);
      return response;
    } catch (err) {
      const messageError = err?.response?.data?.error;
      return rejectWithValue(messageError);
    }
  }
);

export const followUnfollow = createAsyncThunk(
  CONST.FOLLOW_UNFOLLOW,
  async (
    payload: {
      accessToken: string;
      data: {userId: string};
    },
    {rejectWithValue}
  ) => {
    try {
      const response = await followUnfollowApi(payload);
      return response;
    } catch (err) {
      const messageError = err?.response?.data?.error;
      return rejectWithValue(messageError);
    }
  }
);

export const getFollowersFollowing = createAsyncThunk(
  CONST.GET_FOLLOWERS_FOLLOWING,
  async (
    payload: {accessToken: string; menu: string; username: string},
    {rejectWithValue}
  ) => {
    try {
      const response = await getFollowersFollowingApi(payload);
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

export const getPosts = createAsyncThunk(
  CONST.GET_POSTS,
  async (
    payload: {
      accessToken: string;
      data: string;
    },
    {rejectWithValue}
  ) => {
    try {
      const response = await getPostsApi(payload);
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
