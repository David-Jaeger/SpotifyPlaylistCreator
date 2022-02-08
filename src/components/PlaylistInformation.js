import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import _ from "lodash";

const PlaylistInformation = (props) => {
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [image, setImage] = useState("");

  //Gets the playlist information and sends it back to the dashboard
  const handlePlaylistGenerator = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      props.createPlaylist(playlistName, playlistDescription, image);
    }
  };

  //On playlist name change update the value
  const handleNameChange = (event) => {
    const { value } = event.target;
    setPlaylistName(value);
  };

  //On playlist description change update the value
  const handleDescriptionChange = (event) => {
    const { value } = event.target;
    setPlaylistDescription(value);
  };

  //On image change update the value
  const onFileChange = (event) => {
    let temp = event.target.files[0];
    if (!_.isNil(temp)) {
      getBase64(event.target.files[0]);
      const fsize = event.target.files[0].size;
      const file = Math.round(fsize / 1024);
      if (file > 100) {
        props.sendAlert("File to big","File size is too big might not work :<");
      }
    } else {
      setImage("");
    }
  };

  //Base64 the image because the spotify api needs the image to be in base64 format
  const getBase64 = (file) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  };

  return (
    <div className="playlist">
      <Form onSubmit={handlePlaylistGenerator}>
        <Form.Group controlId="formPlaylistName">
          <Form.Label>Playlist Name</Form.Label>
          <Form.Control
            value={playlistName}
            onChange={handleNameChange}
            name="playlistName"
            type="text"
            placeholder=""
            required
          />
          <Form.Text className="text-muted">Required</Form.Text>
          <Form.Label>Playlist Description</Form.Label>
          <Form.Control
            value={playlistDescription}
            onChange={handleDescriptionChange}
            name="playlistDescription"
            type="text"
            placeholder=""
            required
          />
          <Form.Text className="text-muted">Required</Form.Text>
        </Form.Group>

        <Form.Group controlId="formPlaylistPic">
          <Form.Label>Custom Playlist Image</Form.Label>
          <Form.Control
            onChange={(e) => onFileChange(e)}
            accept="image/jpeg"
            type="file"
          />
          <Form.Text className="text-muted">
            Must be a jpg and needs to be less then 100 KB
          </Form.Text>
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default PlaylistInformation;
