import React from "react";
import { withRouter } from "react-router-dom";

function CorrectVideo(props) {
  return (
    <div>
      {props.writerId === props.userId && (
        <a href={`/video/correct/${props.videoId}`}>
          <span style={{ cursor: "pointer" }}>비디오 정보 수정</span>
        </a>
      )}
    </div>
  );
}

export default withRouter(CorrectVideo);
