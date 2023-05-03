import {createSlice} from "@reduxjs/toolkit";
import {
  signOut,
  getProfile,
  editProfile,
  getPosts,
  getPostsLiked,
  createPosts,
  likeUnLike,
  getPostComments,
  createPostComment,
} from "../actions";

const rootSlice = createSlice({
  name: "root",
  initialState: {
    reload: false,
    session: {accessToken: "", id: 0, username: "", avatar: ""},
    getProfile: {
      fetch: false,
      data: {
        userId: "",
      },
      error: "",
    },
    editProfile: {
      fetch: false,
      data: {
        userId: "",
      },
      error: "",
    },
    getPostsLiked: {
      fetch: false,
      data: [],
      error: "",
    },
    createPosts: {
      fetch: false,
      data: {postId: ""},
      error: [],
    },
    likeUnLike: {
      fetch: false,
      data: {
        postId: "",
      },
      error: "",
    },
    getPostComments: {
      fetch: false,
      data: [],
      error: "",
    },
    createPostComment: {
      fetch: false,
      data: {id: 0},
      error: [],
    },
  },
  reducers: {
    setSession(state, action) {
      state.session = action.payload;
    },
    setReload(state, action) {
      state.reload = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signOut.fulfilled, (state) => {
      state.session = {accessToken: "", id: 0, username: "", avatar: ""};
    });

    builder.addCase(getProfile.pending, (state, action) => {
      state.getProfile = {...state.getProfile, fetch: true};
    });
    builder.addCase(getProfile.fulfilled, (state, action) => {
      const payload = action?.payload;
      state.getProfile = {
        ...state.getProfile,
        fetch: false,
        data: payload?.data?.data,
      };
    });
    builder.addCase(getProfile.rejected, (state, action) => {
      const payload = action?.payload;
      state.getProfile = {
        ...state.getProfile,
        fetch: false,
        error: payload,
      };
    });

    builder.addCase(editProfile.pending, (state, action) => {
      state.editProfile = {...state.editProfile, fetch: true};
    });
    builder.addCase(editProfile.fulfilled, (state, action) => {
      const payload = action?.payload;
      state.editProfile = {
        ...state.editProfile,
        fetch: false,
        data: payload?.data?.data,
      };
    });
    builder.addCase(editProfile.rejected, (state, action) => {
      const payload = action?.payload;
      state.editProfile = {
        ...state.editProfile,
        fetch: false,
        error: payload,
      };
    });

    builder.addCase(getPostsLiked.pending, (state, action) => {
      state.getPostsLiked = {...state.getPostsLiked, fetch: true};
    });
    builder.addCase(getPostsLiked.fulfilled, (state, action) => {
      const payload = action?.payload;
      state.getPostsLiked = {
        ...state.getPostsLiked,
        fetch: false,
        data: payload?.data?.data,
      };
    });
    builder.addCase(getPostsLiked.rejected, (state, action) => {
      const payload = action?.payload;
      state.getPostsLiked = {
        ...state.getPostsLiked,
        fetch: false,
        error: payload,
      };
    });

    builder.addCase(createPosts.pending, (state, action) => {
      state.createPosts = {...state.createPosts, fetch: true};
    });
    builder.addCase(createPosts.fulfilled, (state, action) => {
      const payload = action?.payload;
      state.createPosts = {
        ...state.createPosts,
        fetch: false,
        data: payload?.data?.data,
      };
    });
    builder.addCase(createPosts.rejected, (state, action) => {
      let payload = action?.payload;
      if (Array.isArray(payload)) {
        payload = payload[0];
      }
      state.createPosts = {
        ...state.createPosts,
        fetch: false,
        error: payload,
      };
    });

    builder.addCase(likeUnLike.pending, (state, action) => {
      state.likeUnLike = {...state.likeUnLike, fetch: true};
    });
    builder.addCase(likeUnLike.fulfilled, (state, action) => {
      const payload = action?.payload;
      state.likeUnLike = {
        ...state.likeUnLike,
        fetch: false,
        data: payload?.data?.data,
      };
    });
    builder.addCase(likeUnLike.rejected, (state, action) => {
      const payload = action?.payload;
      state.likeUnLike = {
        ...state.likeUnLike,
        fetch: false,
        error: payload,
      };
    });

    builder.addCase(getPostComments.pending, (state, action) => {
      state.getPostComments = {...state.getPostComments, fetch: true};
    });
    builder.addCase(getPostComments.fulfilled, (state, action) => {
      const payload = action?.payload;
      state.getPostComments = {
        ...state.getPostComments,
        fetch: false,
        data: payload?.data?.data,
      };
    });
    builder.addCase(getPostComments.rejected, (state, action) => {
      const payload = action?.payload;
      state.getPostComments = {
        ...state.getPostComments,
        fetch: false,
        error: payload,
      };
    });

    builder.addCase(createPostComment.pending, (state, action) => {
      state.createPostComment = {...state.createPostComment, fetch: true};
    });
    builder.addCase(createPostComment.fulfilled, (state, action) => {
      const payload = action?.payload;
      state.createPostComment = {
        ...state.createPostComment,
        fetch: false,
        data: payload?.data?.data,
      };
    });
    builder.addCase(createPostComment.rejected, (state, action) => {
      const payload = action?.payload;
      state.createPostComment = {
        ...state.createPostComment,
        fetch: false,
        error: payload,
      };
    });
  },
});

export const {
  setSession,
  setReload,
  resetSignIn,
  resetSignUp,
  resetGetProfile,
} = rootSlice.actions;

export default rootSlice.reducer;
