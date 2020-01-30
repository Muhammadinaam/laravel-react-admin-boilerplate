import React, { Component } from "react";
import { Link } from "react-router-dom";
import Auth from "../classes/Auth";


export class AddNewBtn extends Component {
  render() {
    return Auth.hasPermission(this.props.permission) && (
      <Link
        className={"btn btn-sm btn-primary float-right " + this.props.className}
        to={this.props.url}
      >
        <i className={"fa fa-plus-circle"}></i> Add New
      </Link>
    );
  }
}

export default AddNewBtn;