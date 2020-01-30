import Auth from "./../classes/Auth";
import React from "react";
import { Route } from "react-router-dom";
import NoPermission from '../views/CommonViews/NoPermission';

export const PrivateRoute = ({ component: Component, permission, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        Auth.hasPermission(permission) ? <Component {...props} /> : <NoPermission />
      }
    />
  );
}
