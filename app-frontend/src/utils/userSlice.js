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
    updateField: (state, action) => {
      const { path, value } = action.payload;
      if (!state.fields) return;

      const keys = path.split(".");
      let obj = state.fields;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }

      obj[keys[keys.length - 1]] = value;
    },
  },
});

export const { login, logout, add, updateField } = userSlice.actions;

export default userSlice.reducer;
