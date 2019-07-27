import React from "react";
import { Progress } from "semantic-ui-react";

const ProgressBar = props => {
  let progress = null;
  if (props.uploadState) {
    progress = (
      <Progress
        className="progress__bar"
        percent={props.percentUploaded}
        progress
        indicating
        size="medium"
        inverted
      />
    );
  }

  if (props.uploadState === "done") {
    progress = null;
  }

  return progress;
};

export default ProgressBar;
