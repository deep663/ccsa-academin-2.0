import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    fields: null,
  },
  reducers: {
    login: (state, action) => {
      state.fields = action.payload;
    },
    logout: (state) => {
      state.fields = null;
    },
    add: (state, action) => {
      state.fields = { ...state.fields, ...action.payload };
    },
  },
});

export const { login, logout, add } = userSlice.actions;

export default userSlice.reducer;
