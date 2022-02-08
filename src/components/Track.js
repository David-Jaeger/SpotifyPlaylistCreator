import React from "react";
import { ListGroup } from "react-bootstrap";

const Track = (props) => {
  //Opens the song in a new tab of the users browser
  const openSong = () => {
    const win = window.open(props.url, "_blank");
    win.focus();
  };

  return (
    <React.Fragment>
      <ListGroup.Item className="card-tracks" action as="li" onClick={openSong}>
        {props.value}
      </ListGroup.Item>
    </React.Fragment>
  );
};

export default Track;
