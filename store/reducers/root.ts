import {createSlice} from "@reduxjs/toolkit";
import {signOut} from "../actions";

const rootSlice = createSlice({
  name: "root",
  initialState: {
    refetchPost: false,
    session: {accessToken: "", id: 0, username: "", avatar: ""},
    editProfile: {
      fetch: false,
      data: {
        userId: "",
      },
      error: "",
    },
  },
  reducers: {
    setSession(state, action) {
      state.session = action.payload;
    },
    setRefetchPost(state, action) {
      state.refetchPost = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signOut.fulfilled, (state) => {
      state.session = {accessToken: "", id: 0, username: "", avatar: ""};
    });
  },
});

export const {setSession, setRefetchPost} = rootSlice.actions;

export default rootSlice.reducer;
