import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
const user_id = localStorage.getItem("user_id");

interface AuthState {
  isLoading: boolean,
  error: string,
  signupSuccessed: boolean,
  loginSuccessed: boolean,
  token: string,
  role: string,
  authenticated: boolean,
  user_id: string
}

const initialState: AuthState = {
  isLoading: false,
  signupSuccessed: false,
  loginSuccessed: false,
  error: '',
  token: token ? token : '',
  role: role ? role : '',
  authenticated: token ? true : false,
  user_id: user_id ? user_id : ""
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signupRequest: (state, action) => {},
    signupSuccess: (state, action) => {
      state.signupSuccessed = true;
    },
    signupFailure: (state, action) => {
      const { payload } = action;
      state.error = payload;
    },
    loginRequest: (state, action) => {},
    loginSuccess: (state, action) => {
      const { token, role, id } = action.payload;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user_id", id)
      state.role = role;
      state.loginSuccessed = true;
      state.authenticated = true;
      state.user_id = id;
    },
    loginFailure: (state, action) => {

    },
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user_id");
      state.authenticated = false;
      state.role = ""
    }
  },
})

export const { 
  signupRequest, signupSuccess, signupFailure,
  loginRequest, loginSuccess, loginFailure,
  logout
} = authSlice.actions;

export default authSlice.reducer