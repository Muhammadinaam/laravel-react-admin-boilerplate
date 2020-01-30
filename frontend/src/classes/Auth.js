import axios from "axios";
import * as moment from 'moment';
import Intercept from './Intercept';

export default class Auth {

  static access_token = null;
  static userInformationAndSettings = {};

  static login(_username, _password, successCallBack, errorCallBack) {
    Intercept.addAuthToken = false;
    axios
      .post(process.env.REACT_APP_API_URL + "oauth/token", {
        grant_type: "password",
        client_id: process.env.REACT_APP_CLIENT_ID,
        client_secret: process.env.REACT_APP_CLIENT_SECRET,
        username: _username,
        password: _password,
        scope: ""
      })
      .then(response => {
        Intercept.addAuthToken = true;
        const access_token = response["data"]["access_token"];
        const refresh_token = response["data"]["refresh_token"];
        const expires_in = response["data"]["expires_in"];
        if (access_token && access_token !== "") {
          Auth.saveTokenResponse(access_token, refresh_token, expires_in);
          successCallBack();
        } else {
          console.log(response);
          errorCallBack("Unable to get access token from server");
        }
      })
      .catch(error => {
        console.log(error.response);
        if (error.response) {
          if (error.response.status === 400) {
            errorCallBack("Username or Password is not correct");
          } else {
            errorCallBack(error.response.data.message);
          }
        }
      }).finally(() => {
        Intercept.addAuthToken = true;
      });
  }

  static logout(cb) {
    localStorage.clear();
    Auth.access_token = null;
    Auth.UserInformationAndSettings = {};
    cb();
  }

  static saveTokenResponse(access_token, refresh_token, expires_in) {
    Auth.access_token = access_token;
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("expires_at", moment().add(expires_in, 'seconds').valueOf());
  }

  static async isLoggedIn() {
    const access_token = await Auth.getToken();
    let loggedIn = access_token != null && access_token !== "";
    return loggedIn;
  }

  static loadUserInformationAndSettings(successCallback, errorCallback) {
    let userInformationPromise = axios.get(process.env.REACT_APP_API_URL + "api/get-loggedin-user-information")
      .then(response => {
        Auth.userInformationAndSettings['user_information'] = response.data;
        console.log(Auth.userInformationAndSettings['user_information']);
      })

    Promise.all([userInformationPromise])
      .then(response => {
        successCallback();
      })
      .catch(error => {
        errorCallback(error);
      })

  }

  static hasPermission(permissionIdt) {
    let userInformation = Auth.userInformationAndSettings['user_information']
    if (userInformation.is_super_admin === 1 || userInformation.is_super_admin === '1') {
      return true;
    }

    let permissions = userInformation.role?.permissions;
    if (permissions != null) {
      const foundPermission = permissions.find(p => p.idt === permissionIdt);
      return foundPermission != null;
    }

    return false;
  }

  static async getFreshToken(refresh_token) {
    try {

      Intercept.addAuthToken = false;
      const response = await axios
        .post(process.env.REACT_APP_API_URL + "oauth/token", {
          grant_type: "refresh_token",
          client_id: process.env.REACT_APP_CLIENT_ID,
          client_secret: process.env.REACT_APP_CLIENT_SECRET,
          'refresh_token': refresh_token,
          scope: ""
        });


      Intercept.addAuthToken = true;
      const access_token = response["data"]["access_token"];
      const new_refresh_token = response["data"]["refresh_token"];
      const expires_in = response["data"]["expires_in"];
      if (access_token && access_token !== "") {
        Auth.saveTokenResponse(access_token, new_refresh_token, expires_in)
        return Promise.resolve(Auth.access_token);
      } else {
        alert('Error occurred in refreshing auth token');
        return Promise.resolve('');
      }
    }
    catch (error) {
      Intercept.addAuthToken = true;
      console.log(error.response);
      if (error.response) {
        alert('Error occurred in refreshing auth token. Error Message: ' + error.response.data.message);
      }
      return Promise.reslove('');
    }
    finally {
      Intercept.addAuthToken = true;
    }
  }

  static async getToken() {
    const access_token = Auth.access_token;
    const refresh_token = localStorage.getItem('refresh_token');
    const expires_at = moment(localStorage.getItem('expires_at'), 'x');



    if (access_token == null) {
      if (refresh_token == null || expires_at == null) {
        return Promise.resolve('');
      } else {

        let fresh_token = await Auth.getFreshToken(refresh_token);

        return Promise.resolve(fresh_token);
      }
    } else {
      if (moment() > expires_at) {
        let fresh_token = await Auth.getFreshToken(refresh_token);
        return Promise.resolve(fresh_token);
      } else {
        return Promise.resolve(access_token);
      }
    }

  }
}
