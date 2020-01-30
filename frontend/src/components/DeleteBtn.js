import React, { Component } from "react";
import CrudHelper from "../classes/CrudHelper";
import Swal from 'sweetalert2';
import Auth from "../classes/Auth";

export class DeleteBtn extends Component {
  deleteBtnClicked = e => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Record will be deleted permanently",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        CrudHelper.deleteResource(this.props.url, this.props.id, this.props.callBack)
      }
    })
  };
  render() {
    return Auth.hasPermission(this.props.permission) && (
      <button
        className={"btn btn-sm btn-danger " + this.props.className}
        onClick={this.deleteBtnClicked}
      >
        <i className="fa fa-trash"></i>
      </button>
    );
  }
}

export default DeleteBtn;
