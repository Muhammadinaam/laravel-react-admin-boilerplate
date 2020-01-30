import axios from "axios";
import Swal from 'sweetalert2';

export default class CrudHelper {

  static loadAll(resourceUrl) {
    return axios.get(process.env.REACT_APP_API_URL +
      "api/" +
      resourceUrl);
  }

  static storeOrUpdate(method, resourceUrl, resourceId, data, successCallback) {
    let axiosMethod = "";
    let axiosUrl = "";
    if (method === "store") {
      axiosMethod = "post";
      axiosUrl = process.env.REACT_APP_API_URL + "api/" + resourceUrl;
    } else if (method === "update") {
      axiosMethod = "put";
      axiosUrl =
        process.env.REACT_APP_API_URL + "api/" + resourceUrl + "/" + resourceId;
    } else {
      alert("method should be [store] or [update]");
    }

    return axios({
      method: axiosMethod,
      url: axiosUrl,
      data: data
    }).then(response => {
      Swal.fire({
        icon: response.data["success"] === true ? "success" : "error",
        title: response.data["success"] === true ? "Success" : "Error",
        text: response.data["message"]
      }).then(() => {
        if (response.data["success"] === true) {
          successCallback()
        }
      });
    });
  }

  static loadResourceForEdit(resourceUrl, resourceId) {
    return axios.get(
      process.env.REACT_APP_API_URL +
      "api/" +
      resourceUrl +
      "/" +
      resourceId +
      "/edit"
    );
  }

  static deleteResource(resourceUrl, resourceId, successCallback) {
    return axios
      .delete(
        process.env.REACT_APP_API_URL + "api/" + resourceUrl + "/" + resourceId
      )
      .then(response => {
        Swal.fire({
          icon: response.data["success"] === true ? "success" : "error",
          title: response.data["success"] === true ? "Success" : "Error",
          text: response.data["message"]
        }).then(() => successCallback());
      });
  }
}
