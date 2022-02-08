import React from "react";
import { Button } from "react-bootstrap";

const CompletedPlaylist = (props) => {
  //Open the playlist in a new tab of the users browser
  const openList = () => {
    const win = window.open(props.url, "_blank");
    win.focus();
  };

  //Send the user back to the begining of the program to make a new list
  const restartList = () => {
    window.location.reload();
  };

  return (
    <React.Fragment>
      <Button
        className="completed-playlist-button"
        size="lg"
        onClick={openList}
        value="yes"
      >
        Completed Playlist
      </Button>

      <br />
      <Button
        className="completed-playlist-button"
        size="lg"
        onClick={restartList}
        value="yes"
      >
        Make a New Playlist
      </Button>
    </React.Fragment>
  );
};

export default CompletedPlaylist;
