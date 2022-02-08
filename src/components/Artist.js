import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import Genre from "./Genre";
import Track from "./Track";
import { BsChevronCompactDown, BsChevronCompactUp } from "react-icons/bs";
import Collapse from "react-bootstrap/Collapse";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import _ from "lodash";

const Artist = (props) => {
  const [genreToggle, setGenreToggle] = useState(false);
  const [trackToggle, setTrackToggle] = useState(false);

  //Adds the artist to the list of approved artists from the user
  const handleKeep = () => {
    props.keepOrKick("keep");
  };

  //Removes the artist from the potential artist list
  const handleKick = () => {
    props.keepOrKick("discard");
  };

  //Toggles the genre/genres of the artist
  const toggleGenre = () => {
    setGenreToggle(!genreToggle);
  };

  //Toggles the tracks of the artist
  const toggleTracks = () => {
    setTrackToggle(!trackToggle);
  };

  return (
    <React.Fragment>
      <Card className="text-center" bg="card" style={{ width: "25rem" }}>
        {!(_.isNil(props.data.images[0])) && (
          <Card.Img variant="top" src={props.data.images[0].url} />
        )}
        <Card.Body>
          <Card.Title className="card-info">Artist</Card.Title>
          <Card.Text>{props.data.name}</Card.Text>
          <hr />
          <Card.Title onClick={toggleGenre} className="card-info artist-toggle">
            Genres
            <br />
            {!genreToggle && <BsChevronCompactDown />}
            {genreToggle && <BsChevronCompactUp />}
          </Card.Title>
          <Collapse in={genreToggle}>
            <Card.Text>
              {props.data.genres.map((genre) => (
                <Genre value={genre} key={genre} />
              ))}
            </Card.Text>
          </Collapse>
          <hr />

          <Card.Title
            onClick={toggleTracks}
            className="card-info artist-toggle"
          >
            Top Tracks
            <br />
            {!trackToggle && <BsChevronCompactDown />}
            {trackToggle && <BsChevronCompactUp />}
          </Card.Title>
          <Collapse in={trackToggle}>
            <Card.Text>
              {props.data.tracks.map((track) => (
                <Track
                  value={track.name}
                  key={track.id}
                  url={track.external_urls.spotify}
                />
              ))}
            </Card.Text>
          </Collapse>
          <Button
            className="artist-button"
            onClick={handleKick}
            variant="primary"
          >
            <FiThumbsDown size="40px" />
          </Button>
          <Button
            className="artist-button"
            onClick={handleKeep}
            variant="primary"
          >
            <FiThumbsUp size="40px" />
          </Button>
        </Card.Body>
      </Card>
    </React.Fragment>
  );
};

export default Artist;
