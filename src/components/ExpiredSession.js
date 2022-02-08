import { Button } from "react-bootstrap";
import React from "react";
import { useHistory } from "react-router-dom";

const ExpiredSession = (props) => {
  const history = useHistory();

  //Sends the user back to the login screen after backing up the data
  const routeChange = () => {
    let path = `/`;
    props.backupData();
    history.push(path);
  };

  return (
    <React.Fragment>
      <div className="center-text">
          <h1>Session Expired</h1>
          <h4>Please re-login in to continue</h4>
          <Button variant="primary" type="submit" onClick={routeChange}>
            Login
          </Button>
      </div>
    </React.Fragment>
  );
};

export default ExpiredSession;
