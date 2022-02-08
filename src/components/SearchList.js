import React from "react";
import { ListGroup } from "react-bootstrap";

const SearchList = (props) => {
  //Sets the main artist for looking at similar artists
  const artistChosen = () => {
    props.choosenArtist(props.id);
  };

  return (
    <React.Fragment>
      <ListGroup.Item action as="li" onClick={artistChosen}>
        {props.value}
      </ListGroup.Item>
    </React.Fragment>
  );
};

export default SearchList;
