import React from "react";
import { Redirect } from "react-router-dom";

const NotFound = (props) => {
  return (
    <React.Fragment>
      <h1>Page not found</h1>
      Redirecting back to login screen
      <Redirect to="/" />
    </React.Fragment>
  );
};

export default NotFound;
