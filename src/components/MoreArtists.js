import React from "react";
import { Button } from "react-bootstrap";

const MoreArtists = (props) => {
  const handleChoice = (event) => {
    props.handleChoice(event.target.value);
  };

  return (
    <React.Fragment>
      <Button className="choice" size="lg" onClick={handleChoice} value="yes">
        Yes
      </Button>
      <Button className="choice" size="lg" onClick={handleChoice} value="no">
        No
      </Button>
    </React.Fragment>
  );
};

export default MoreArtists;
