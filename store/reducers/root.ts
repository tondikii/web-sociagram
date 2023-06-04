import {createSlice} from "@reduxjs/toolkit";
import {signOut, getPosts, getPostsLiked} from "../actions";

const masterInitialState = {
  refetchPost: false,
  session: {accessToken: "", id: 0, username: "", avatar: ""},
  posts: {
    fetch: false,
    data: null,
    error: "",
  },
};

const rootSlice = createSlice({
  name: "root",
  initialState: {...masterInitialState},
  reducers: {
    setSession(state, action) {
      state.session = action.payload;
    },
    setRefetchPost(state, action) {
      state.refetchPost = action.payload;
    },
    setPosts(state: any, action) {
      state.posts = {
        ...state?.posts,
        data: action?.payload,
      };
    },
  },
  extraReducers: (builder) => {
    const {addCase} = builder;
    addCase(signOut.fulfilled, () => ({...masterInitialState}));
    addCase(getPosts.pending, (state) => ({
      ...state,
      posts: {fetch: true, data: null, error: ""},
    }));
    addCase(getPosts.fulfilled, (state, action) => ({
      ...state,
      posts: {fetch: true, data: action?.payload?.rows, error: ""},
    }));
    addCase(getPosts.rejected, (state, action: {payload: any}) => ({
      ...state,
      posts: {fetch: true, data: null, error: action.payload},
    }));
    addCase(getPostsLiked.pending, (state) => ({
      ...state,
      posts: {fetch: true, data: null, error: ""},
    }));
    addCase(getPostsLiked.fulfilled, (state, action) => ({
      ...state,
      posts: {fetch: true, data: action?.payload, error: ""},
    }));
    addCase(getPostsLiked.rejected, (state, action: {payload: any}) => ({
      ...state,
      posts: {fetch: true, data: null, error: action.payload},
    }));
  },
});

export const {setSession, setRefetchPost, setPosts} = rootSlice.actions;

export default rootSlice.reducer;
