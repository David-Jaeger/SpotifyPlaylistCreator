import React from "react";
import { Button } from "react-bootstrap";

const Login = (props) => {
  const {
    REACT_APP_CLIENT_ID,
    REACT_APP_AUTHORIZE_URL,
    REACT_APP_REDIRECT_URL,
  } = process.env;

  //Sends the user over to authantiacate their spotify information and redirect back
  const handleLogin = () => {
    let x =
      "user-read-private user-read-email user-read-playback-state playlist-modify-private playlist-read-private ugc-image-upload ";
    let scopes = encodeURIComponent(x);
    let redirect_uri = encodeURIComponent(REACT_APP_REDIRECT_URL);
    window.location = `${REACT_APP_AUTHORIZE_URL}?client_id=${REACT_APP_CLIENT_ID}&scope=${scopes}&redirect_uri=${redirect_uri}&response_type=token&show_dialog=true`;
  };

  return (
    <div className="login-container">
      <div className="login-component">
        <h1>Spotify Playlist Creator</h1>
        <Button variant="primary" type="submit" onClick={handleLogin}>
          Login to Spotify
        </Button>
      </div>
    </div>
  );
};

export default Login;
