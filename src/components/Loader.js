import Spinner from "react-spinner-material";
import React from "react";

const Loader = (props) => {
  return (
    <React.Fragment>
      <Spinner
        radius={100}
        color={"#535353"}
        stroke={8}
        visible={props.loading}
      />
    </React.Fragment>
  );
};

export default Loader;
