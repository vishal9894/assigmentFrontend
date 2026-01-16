import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  allUser: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null; // reset user to null
    },
    setAllUser: (state, action) => {
      state.allUser = action.payload;
    },
  },
});

export const { setUser, clearUser, setAllUser } = authSlice.actions;
export default authSlice.reducer;
