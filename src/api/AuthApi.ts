import axios from 'axios';
import BaseApi from './BaseApi';

class AuthApi extends BaseApi {  
  login(data: any) {
    return axios.post(
      this.REACT_APP_SERVER_URL + 'login',
      data,
      {      
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }

  signup(data: any) {
    return axios.post(
      this.REACT_APP_SERVER_URL + 'signup',
      data,
      {      
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
}

const authApi = new AuthApi();
export default authApi;
