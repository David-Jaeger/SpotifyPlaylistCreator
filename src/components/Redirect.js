import React from "react";
import _ from "lodash";

class Redirect extends React.Component {
  //Redirects the user over to the dashboard unless an error occurs
  componentDidMount() {
    const { history, location } = this.props;

    try {
      if (_.isEmpty(location.hash)) {
        return history.push("/");
      }
      const access_token = this.getHashParams(location.hash);
      sessionStorage.setItem("params", JSON.stringify(access_token));
      history.push("/dashboard");
    } catch (error) {
      console.log("Something went wrong");
      history.push("/");
    }
  }

  //Converts the hash value into usable parameters
  getHashParams = (val) => {
    let search = val;
    return JSON.parse(
      '{"' +
        search.replace(/#/g, "").replace(/&/g, '","').replace(/=/g, '":"') +
        '"}',
      function (key, value) {
        return key === "" ? value : decodeURIComponent(value);
      }
    );
  };

  render() {
    return null;
  }
}

export default Redirect;
