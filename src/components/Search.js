import React, { useState, useEffect } from "react";
import { Button, InputGroup, FormControl } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";

const Search = (props) => {
  const [search, setSearch] = useState("");
  const searchArtist = props.searchArtist;
  
  //On search value update call the handleSearch function
  useEffect(() => {
    //Makes sure the search isn't empty and then sends the data to create a search request
    const handleSearch = () => {
      if (search.trim() !== "") {
        searchArtist(search);
      }
    };
    handleSearch();
  }, [search, searchArtist]);

  //Sets the state which calls
  const handleInputChange = (event) => {
    const newSearch = event.target.value;
    setSearch(newSearch);
  };

  return (
    <div className="search-container">
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search Artist"
          aria-label="Artist"
          aria-describedby="basic-addon2"
          type="search"
          name="search"
          value={search}
          onChange={handleInputChange}
          autoComplete="off"
        />
        <InputGroup.Append>
          <Button onClick={null} type="submit">
            <BsSearch />
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </div>
  );
};

export default Search;
