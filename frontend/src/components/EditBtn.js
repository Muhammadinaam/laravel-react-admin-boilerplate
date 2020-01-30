import React, { Component } from "react";
import { Link } from "react-router-dom";
import Auth from "../classes/Auth";


export class EditBtn extends Component {
  render() {
    return Auth.hasPermission(this.props.permission) && (
      <Link
        className={"btn btn-sm btn-info " + this.props.className}
        to={this.props.url}
      >
        <i className={"fa fa-edit"}></i>
      </Link>
    );
  }
}

export default EditBtn;
