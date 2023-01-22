import {createSlice} from "@reduxjs/toolkit";
import {signIn, signOut, signUp} from "../actions";

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
  },
});

export default rootSlice.reducer;
