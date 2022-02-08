import React from "react";

const StepHeading = (props) => {
  return (
    <React.Fragment>
      <h4 className="center-text">
        Step {props.step}: {props.label}
      </h4>
    </React.Fragment>
  );
};

export default StepHeading;
