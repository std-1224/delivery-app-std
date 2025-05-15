export default class BaseApi {
  REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL ? process.env.REACT_APP_SERVER_URL : 'http://localhost:8080/'

  getToken() {
    return localStorage.getItem('token');
  }
};