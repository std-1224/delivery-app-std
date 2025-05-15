import { Dispatch } from "redux";

import AuthApi from "../api/AuthApi";
import {
  loginSuccess, loginFailure,
  signupSuccess, signupFailure,
} from "../redux/reducer/authReducer";

export const login = (data: any) => {
  return async (dispatch: Dispatch) => {
    return AuthApi
      .login(data)
      .then(resp => {
        return dispatch(loginSuccess(resp.data.data))
        })
      .catch(error => {
        return dispatch(loginFailure(error.response.data))
      });
  };  
};

export const signup = (data: any) => {
  return async (dispatch: Dispatch) => {
    return AuthApi
      .signup(data)
      .then(resp => {
          return dispatch(signupSuccess(resp.data))
        })
      .catch(error => {
        return dispatch(signupFailure(error.response.data.statusText))
      });
  };  
};
