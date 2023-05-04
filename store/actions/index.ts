import * as CONST from "../constant";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {deleteCookie} from "cookies-next";

export const signOut = createAsyncThunk(CONST.SIGN_OUT, async () => {
  deleteCookie("accessToken");
  localStorage.clear();
  return true;
});
