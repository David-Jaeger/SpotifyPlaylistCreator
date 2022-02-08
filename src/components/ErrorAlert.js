import React from "react";
import { Alert } from "react-bootstrap";

const ErrorAlert = (props) => {
  //Closes the alert
  const handleClose = () => {
    props.handleClose();
  };

  return (
    <Alert variant="danger" onClose={handleClose} dismissible>
      <Alert.Heading>{props.info.title}</Alert.Heading>
      <p>{props.info.message}</p>
    </Alert>
  );
};

export default ErrorAlert;
