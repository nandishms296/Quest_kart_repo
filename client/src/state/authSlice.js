import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    mode: "light",
    openLogin: false,
    user: {
      id: 1,
      full_name: "John Jones",
      login_id: "jjones",
      password: "$2b$04$8Le9rrExZkKe1XEs9QK8/Od5tpoXAMiKciVcI4OJMWUKLZFyepK6.",
      user_email: "jjones@mail.com",
      user_phone: "4081231234",
      is_active: "Y",
      created_by: "system",
      created_dttm: "2022-12-22T05:15:18.000Z",
      updated_by: "system",
      updated_dttm: "2023-02-20T00:27:02.000Z",
    },
    token: "4$8Le9rrExZkKe1XEs9QK8/Od5tpoXAMiKciVcI4OJMWUKLZFyepK6",
  },
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setOpenLogin: (state, action) => {
      const { openLogin } = action.payload;
      state.openLogin = openLogin;
    },
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
    },
    logOut: (state, action) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setMode, setOpenLogin, setCredentials, logOut } =
  authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
