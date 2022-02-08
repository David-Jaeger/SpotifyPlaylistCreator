import React from "react";
import Spotify from "spotify-web-api-js";
import Search from "./Search";
import SearchList from "./SearchList";
import _ from "lodash";
import { ListGroup } from "react-bootstrap";
import Artist from "./Artist";
import PlaylistInformation from "./PlaylistInformation";
import StepHeading from "./StepHeading";
import MoreArtists from "./MoreArtists";
import CompletedPlaylist from "./CompletedPlaylist";
import Loader from "./Loader";
import ExpiredSession from "./ExpiredSession";
import ErrorAlert from "./ErrorAlert";

const spotifyWebApi = new Spotify();

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    spotifyWebApi.setAccessToken(
      JSON.parse(sessionStorage.getItem("params")).access_token
    );
    let expirySeconds = JSON.parse(sessionStorage.getItem("params")).expires_in;
    const expiryTime = new Date().getTime() + expirySeconds * 1000;

    this.state = {
      searchList: [],
      relatedArtists: [],
      choosenRelated: [],
      playlistInfo: {},
      stepCounter: 1,
      completedPlaylist: {},
      loading: false,
      validSession: true,
      errorAlert: {},
      expiryTime: expiryTime,
      keepValues: false,
    };
  }

  componentDidMount() {
    let backupData = JSON.parse(sessionStorage.getItem("backup_data"));

    //Keeps values based on if the user relogged, reloaded or is starting the app for the first time
    try {
      if (!_.isNil(backupData)) {
        if (backupData.keepValues) {
          this.setState({
            ...backupData,
            keepValues: false,
            validSession: true,
            expiryTime: this.state.expiryTime,
          });
          this.backupStateSession();
        } else {
          this.setState(
            {
              expiryTime: backupData.expiryTime,
            },
            () => {
              this.backupStateSession();
            }
          );
        }
      } else {
        this.backupStateSession();
      }
    } catch (error) {}
  }

  //Checks if the access token is still valid
  checkTime = () => {
    const currentTime = new Date().getTime();
    if (currentTime >= this.state.expiryTime) {
      this.setState({
        keepValues: true,
        validSession: false,
      });
      return false;
    } else {
      this.backupStateSession();
      return true;
    }
  };

  //Searches the artist in the spotify database
  searchArtist = (searchTerm) => {
    if (this.checkTime()) {
      try {
        spotifyWebApi.searchArtists(searchTerm).then(async (response) => {
          this.setState({
            searchList: response.artists.items,
          });
        });
      } catch (error) {
        console.log("Error with searching artist", error);
      }
    }
  };

  //Gets related artists of the selected artist
  artistChosen = (artist) => {
    if (this.checkTime()) {
      this.getRelatedArtists(artist);
    }
  };

  //Gets the related artists of the choosen artist by spotify
  getRelatedArtists = (artist) => {
    if (this.checkTime()) {
      try {
        spotifyWebApi.getArtistRelatedArtists(artist).then((response) => {
          if (!_.isEmpty(response.artists)) {
            response.artists.forEach((elem, index) =>
              this.getArtistTracks(elem, "US")
            );
            this.incrementStepCounter();
          } else {
            let tempAlert = {
              title: "No related artists",
              message:
                "There are no related artists to the choosen artist. Please choose another artist!",
            };
            this.setAlert(tempAlert.title, tempAlert.message);
          }
        });
      } catch (error) {
        console.log("Error with getting related artists", error);
      }
    }
  };

  //Gets the artists informaton
  getArtist = (artist) => {
    if (this.checkTime()) {
      try {
        spotifyWebApi.getArtist(artist).then((response) => {
          return response;
        });
      } catch (error) {
        console.log("Error with getting artist", error);
      }
    }
  };

  //Adds the related artist from the pool to the choosen artists or removes them from the pool
  keepOrKick = (choice) => {
    if (this.checkTime()) {
      let choosen = this.state.choosenRelated;
      let related = this.state.relatedArtists;
      let step = this.state.stepCounter;
      if (choice === "keep") {
        choosen.push(related.shift());
      } else {
        related.shift();
      }
      if (_.isEmpty(related)) {
        if (_.isEmpty(this.state.choosenRelated)) {
          step = 1;
          this.setAlert("No related artists choosen", "Choose a new artist!");
        } else {
          ++step;
        }
      }
      this.setState({
        choosenRelated: choosen,
        relatedArtists: related,
        stepCounter: step,
      });
    }
  };

  //Gets the top tracks of the given artist
  getArtistTracks = (artist, country) => {
    if (this.checkTime()) {
      try {
        spotifyWebApi
          .getArtistTopTracks(artist.id, country)
          .then((response) => {
            artist = {
              ...artist,
              tracks: response.tracks,
            };
            let tempArray = this.state.relatedArtists;
            tempArray.push(artist);
            this.setState({
              relatedArtists: tempArray,
            });
          });
      } catch (error) {
        console.log("Error with getting artists tracks", error);
      }
    }
  };

  //Handles if the user wants to add more artists to their playlist
  handleChoice = (value) => {
    value === "yes"
      ? this.setState({ searchList: [], relatedArtists: [], stepCounter: 1 })
      : this.incrementStepCounter();
    this.backupStateSession();
  };

  //Creates a basic empty playlist as a starting point for adding songs/images
  createPlaylist = (playlistName, playlistDescription, playlistImage) => {
    if (this.checkTime()) {
      this.setState({
        playlistInfo: {
          playlistName: playlistName,
          playlistDescription: playlistDescription,
          playlistImage: playlistImage,
        },
      });
      this.getMe();
    }
  };

  //Gets the users info
  getMe = () => {
    if (this.checkTime()) {
      try {
        spotifyWebApi.getMe().then((response) => {
          this.generatePlaylist(response);
        });
      } catch (error) {
        console.log("Error with getting user id", error);
      }
    }
  };

  //Creates the starting point of a playlist based on the entered name, description and image
  generatePlaylist = (user) => {
    if (this.checkTime()) {
      const userId = user.id;
      const playlistInfo = {
        name: this.state.playlistInfo.playlistName,
        description: this.state.playlistInfo.playlistDescription,
        public: false,
      };
      spotifyWebApi.createPlaylist(userId, playlistInfo).then((response) => {
        this.addSongs(response);
      });
    }
  };

  //Grabs all the songs from all the choosen artists and then
  addSongs = (playlistInfo) => {
    if (this.checkTime()) {
      let tempArray = [];
      this.state.choosenRelated.forEach((elem, index) =>
        elem.tracks.forEach((elem, index) => tempArray.push(elem.uri))
      );
      this.addingTracks(playlistInfo, tempArray);
    }
  };

  //Splits the song list up due to size limits
  addingTracks = (playlist, tracks) => {
    try {
      this.toggleLoadScreen();
      let tempArray = this.splitUpArray(tracks, 100);
      tempArray.forEach((elem, index) =>
        spotifyWebApi
          .addTracksToPlaylist(playlist.id, elem)
          .then((response) => {})
      );

      //If an image was given proceed to another spotify call to upload the image
      this.state.playlistInfo.playlistImage
        ? this.uploadPlaylistImage(playlist)
        : this.finishPlaylist(playlist.external_urls.spotify);
    } catch (error) {
      console.log("Error with adding tracks", error);
    }
  };

  //Splits up the array into smaller chunks for the api call
  splitUpArray = (array, size) => {
    try {
      let splitArray = [];
      for (let i = 0; i < array.length; i += size) {
        splitArray.push(array.slice(i, i + size));
      }
      return splitArray;
    } catch (error) {
      console.log("Error with spliting the array", error);
    }
  };

  //Uploads the image to the playlist
  uploadPlaylistImage = (playlist) => {
    try {
      spotifyWebApi
        .uploadCustomPlaylistCoverImage(
          playlist.id,
          this.state.playlistInfo.playlistImage
        )
        .then((response) => {
          this.finishPlaylist(playlist.external_urls.spotify);
        });
    } catch (error) {
      console.log("Error with uploading playlist image", error);
    }
  };

  //Finishes the playlist and send user to the final part of the app
  finishPlaylist = (playlist) => {
    this.toggleLoadScreen();
    this.setState({ completedPlaylist: playlist });
    this.incrementStepCounter();
  };

  //Increases the step counter to allow the user onto the next step
  incrementStepCounter = () => {
    this.setState({ stepCounter: this.state.stepCounter + 1 });
  };

  //Toggles the load screen
  toggleLoadScreen = () => {
    this.setState({ loading: !this.state.loading });
  };

  //Backs up the playlist information into session storage
  backupStateSession = () => {
    let backupState = JSON.stringify(this.state);
    sessionStorage.setItem("backup_data", backupState);
  };

  //Closes the alert
  removeAlert = () => {
    if (this.checkTime()) {
      this.setState({
        errorAlert: {},
      });
    }
  };

  //Sets the alerts title and message
  setAlert = (t, m) => {
    if (this.checkTime()) {
      this.setState({
        errorAlert: {
          title: t,
          message: m,
        },
      });
    }
  };

  render() {
    return (
      <div className="dashboard-container">
        {!_.isEmpty(this.state.errorAlert) && (
          <div className="alert">
            <ErrorAlert
              info={this.state.errorAlert}
              handleClose={this.removeAlert}
            ></ErrorAlert>
          </div>
        )}
        {this.state.validSession && (
          <div>
            {this.state.loading && (
              <div className="loading">
                <Loader loading={this.state.loading}></Loader>
              </div>
            )}

            {this.state.stepCounter === 1 && !this.state.loading && (
              <div className="step-one" style={{ width: "30rem" }}>
                <div>
                  <StepHeading
                    step={this.state.stepCounter}
                    label="Find an artist you like"
                  ></StepHeading>
                </div>
                <div>
                  <Search
                    stepLabel=""
                    step={this.state.stepCounter}
                    searchArtist={this.searchArtist}
                  />
                </div>
                <div>
                  {!_.isEmpty(this.state.searchList) && (
                    <div>
                      <ListGroup as="ul">
                        {this.state.searchList.map((search) => (
                          <SearchList
                            choosenArtist={this.artistChosen}
                            key={search.id}
                            value={search.name}
                            id={search.id}
                          />
                        ))}
                      </ListGroup>
                    </div>
                  )}
                </div>
              </div>
            )}

            {this.state.stepCounter === 2 && !this.state.loading && (
              <div className="step-two">
                <div>
                  <StepHeading
                    step={this.state.stepCounter}
                    label="Pick which artists to keep"
                  ></StepHeading>
                </div>
                <div>
                  {!_.isEmpty(this.state.relatedArtists) && (
                    <div className="artist">
                      <Artist
                        keepOrKick={this.keepOrKick}
                        data={this.state.relatedArtists[0]}
                      ></Artist>
                    </div>
                  )}
                </div>
              </div>
            )}

            {this.state.stepCounter === 3 && !this.state.loading && (
              <div className="step-three">
                <div>
                  <StepHeading
                    step={this.state.stepCounter}
                    label="Would you like to add more artists?"
                  ></StepHeading>
                </div>
                <div>
                  {_.isEmpty(this.state.relatedArtists) && (
                    <div className="center-text">
                      <MoreArtists
                        handleChoice={this.handleChoice}
                      ></MoreArtists>
                    </div>
                  )}
                </div>
              </div>
            )}

            {this.state.stepCounter === 4 && !this.state.loading && (
              <div className="step-four">
                <div>
                  <StepHeading
                    step={this.state.stepCounter}
                    label="Enter playlist information"
                  />
                </div>
                <div>
                  {_.isEmpty(this.state.relatedArtists) &&
                    !_.isEmpty(this.state.choosenRelated) && (
                      <div>
                        <ListGroup as="ul">
                          <PlaylistInformation
                            sendAlert={this.setAlert}
                            createPlaylist={this.createPlaylist}
                          />
                        </ListGroup>
                      </div>
                    )}
                </div>
              </div>
            )}

            {this.state.stepCounter === 5 && !this.state.loading && (
              <div className="step-five">
                <StepHeading
                  step={this.state.stepCounter}
                  label="Time to listen to your playlist or make a new one"
                />
                <div className="completed-playlist-container">
                  <CompletedPlaylist
                    url={this.state.completedPlaylist}
                  ></CompletedPlaylist>
                </div>
              </div>
            )}
          </div>
        )}

        {!this.state.validSession && (
          <div className="expired-session">
            <ExpiredSession
              backupData={this.backupStateSession}
            ></ExpiredSession>
          </div>
        )}
      </div>
    );
  }
}

export default Dashboard;
