import axios from "axios";
import history from "./History";
import Auth from "./Auth";
import Swal from 'sweetalert2';

export default class Intercept {

  static addAuthToken = true;

  static setRequestInterceptors() {
    // Add a request interceptor
    axios.interceptors.request.use(
      async function (config) {
        // Do something before request is sent
        
        config.headers = {
          Accept: "application/json",
          'Content-Type': "application/json"
        };

        if(Intercept.addAuthToken === true) {
          const accessToken = await Auth.getToken();
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        return config;
      },
      function (error) {
        // Do something with request error
        console.log(error);
        return Promise.reject(error);
      }
    );
  }

  static setResponseInterceptors() {
    // Add a response interceptor
    axios.interceptors.response.use(
      function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
      },
      function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error

        console.log(error);
        console.log(error.response);
        if (error.response) {
          if (error.response.status === 401) {
            Auth.logout(function () { });
            history.push("login");
          }

          else if (error.response.status === 422) {

            let errors = error.response.data.errors;
            let errorHtml = '<ul style="text-align: left;">';

            Object.keys(errors).forEach(errorKey => {
              errors[errorKey].forEach(errorMessage => {
                errorHtml += '<li>' + errorMessage + '</li>';
              })
            });

            errorHtml += '</ul>';
            const wrapper = document.createElement('div');
            wrapper.innerHTML = errorHtml;

            Swal.fire({
              icon: "error",
              title: "The given data was invalid.",
              content: wrapper
            });
          }

          else if (error.response.status === 403) {
            Swal.fire({
              icon: "warning",
              title: "No Permission",
              text: 'You do not have permission to perform this operation'
            });
            console.log(error.response);
          }

          else if (error.response.status === 500) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: error.response.statusText
            });
            console.log(error.response);
          }

          else if (error.response.status === 400) {
            // don't do anything
          }

          else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Server Error Occurred. Status Code: " + error.response.status
            });
          }

        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Server Error Occurred"
          });
        }

        return Promise.reject(error);
      }
    );
  }
}
