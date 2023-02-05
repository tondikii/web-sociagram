import {createSlice} from "@reduxjs/toolkit";
import {
  signIn,
  signOut,
  signUp,
  getProfile,
  editProfile,
  searchUsers,
  followUnfollow,
  getFollowersFollowing,
} from "../actions";

const rootSlice = createSlice({
  name: "root",
  initialState: {
    signIn: {
      fetch: false,
      data: {accessToken: ""},
      error: "",
    },
    signUp: {
      fetch: false,
      data: {userId: ""},
      error: "",
    },
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
    searchUsers: {
      fetch: false,
      data: {
        count: 0,
        rows: [],
      },
      error: "",
    },
    followUnfollow: {
      fetch: false,
      data: {
        userId: "",
      },
      error: "",
    },
    getFollowersFollowing: {
      fetch: false,
      data: [],
      error: "",
    },
    getFollowing: {
      fetch: false,
      data: [],
      error: "",
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signUp.pending, (state, action) => {
      state.signUp = {...state.signUp, fetch: true};
    });
    builder.addCase(signUp.fulfilled, (state, action) => {
      const payload = action?.payload;
      state.signUp = {
        ...state.signUp,
        fetch: false,
        data: payload?.data?.data,
      };
    });
    builder.addCase(signUp.rejected, (state, action) => {
      let payload = action?.payload;
      if (Array.isArray(payload)) {
        payload = payload[0];
      }
      state.signUp = {
        ...state.signUp,
        fetch: false,
        error: payload,
      };
    });

    builder.addCase(signIn.pending, (state, action) => {
      state.signIn = {...state.signIn, fetch: true};
    });
    builder.addCase(signIn.fulfilled, (state, action) => {
      const payload = action?.payload;
      state.signIn = {
        ...state.signIn,
        fetch: false,
        data: payload?.data?.data,
      };
    });
    builder.addCase(signIn.rejected, (state, action) => {
      const payload = action?.payload;
      state.signIn = {
        ...state.signIn,
        fetch: false,
        error: payload,
      };
    });

    builder.addCase(signOut.fulfilled, (state, action) => {
      state.signIn = {
        fetch: false,
        data: {accessToken: ""},
        error: "",
      };
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

    builder.addCase(searchUsers.pending, (state, action) => {
      state.searchUsers = {...state.searchUsers, fetch: true};
    });
    builder.addCase(searchUsers.fulfilled, (state, action) => {
      const payload = action?.payload;
      state.searchUsers = {
        ...state.searchUsers,
        fetch: false,
        data: payload?.data?.data,
      };
    });
    builder.addCase(searchUsers.rejected, (state, action) => {
      const payload = action?.payload;
      state.searchUsers = {
        ...state.searchUsers,
        fetch: false,
        error: payload,
      };
    });

    builder.addCase(followUnfollow.pending, (state, action) => {
      state.followUnfollow = {...state.followUnfollow, fetch: true};
    });
    builder.addCase(followUnfollow.fulfilled, (state, action) => {
      const payload = action?.payload;
      state.followUnfollow = {
        ...state.followUnfollow,
        fetch: false,
        data: payload?.data?.data,
      };
    });
    builder.addCase(followUnfollow.rejected, (state, action) => {
      const payload = action?.payload;
      state.followUnfollow = {
        ...state.followUnfollow,
        fetch: false,
        error: payload,
      };
    });

    builder.addCase(getFollowersFollowing.pending, (state, action) => {
      state.getFollowersFollowing = {
        ...state.getFollowersFollowing,
        fetch: true,
      };
    });
    builder.addCase(getFollowersFollowing.fulfilled, (state, action) => {
      const payload = action?.payload;
      state.getFollowersFollowing = {
        ...state.getFollowersFollowing,
        fetch: false,
        data: payload?.data?.data,
      };
    });
    builder.addCase(getFollowersFollowing.rejected, (state, action) => {
      const payload = action?.payload;
      state.getFollowersFollowing = {
        ...state.getFollowersFollowing,
        fetch: false,
        error: payload,
      };
    });
  },
});

export default rootSlice.reducer;
