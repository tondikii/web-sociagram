import {createSlice} from "@reduxjs/toolkit";
import {signOut, createPosts} from "../actions";

const rootSlice = createSlice({
  name: "root",
  initialState: {
    reload: false,
    session: {accessToken: "", id: 0, username: "", avatar: ""},
    editProfile: {
      fetch: false,
      data: {
        userId: "",
      },
      error: "",
    },
    createPosts: {
      fetch: false,
      data: {postId: ""},
      error: [],
    },
    getPostComments: {
      fetch: false,
      data: [],
      error: "",
    },
  },
  reducers: {
    setSession(state, action) {
      state.session = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signOut.fulfilled, (state) => {
      state.session = {accessToken: "", id: 0, username: "", avatar: ""};
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
  },
});

export const {setSession} = rootSlice.actions;

export default rootSlice.reducer;
