import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  role: "",
  name: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userRoleUpdate: (state, action) => {
      state.role = action.payload;
    },
    userNameUpdate: (state, action) => {
      state.name = action.payload;
    },
  },
});

export const { userRoleUpdate, userNameUpdate } = userSlice.actions;

export default userSlice.reducer;
