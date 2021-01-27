import React, { useEffect, useState } from "react";
import Axios from "axios";
function SideVideo() {
  const [SideVideos, setSideVideos] = useState([]);

  useEffect(() => {
    Axios.get("/api/video/getVideos").then((response) => {
      if (response.data.success) {
        setSideVideos(response.data.videos);
      } else {
        alert("사이드 비디오 정보를 불러오지 못했습니다.");
      }
    });
  }, []);

  const renderSideVideo = SideVideos.map((video, index) => {
    // Math.floor() 함수는 주어진 숫자와 같거나 작은 정수 중에서 가장 큰 수를 반환합니다.
    let minutes = Math.floor(video.duration / 60);
    let seconds = Math.floor(video.duration - minutes * 60);

    return (
      <div
        key={index}
        style={{
          display: "flex",
          marginBottom: "1rem",
          padding: "0 2rem",
        }}
      >
        <div style={{ width: "40%", marginRight: "1rem" }}>
          {/* 이거 페이지 이동하는거, 자꾸 헷갈리니까 기억하자. */}
          <a href={`/video/${video._id}`}>
            <img
              style={{ width: "100%", height: "100%" }}
              src={`http://localhost:5000/${video.thumbnail}`}
              alt="thumbnail"
            />
          </a>
        </div>

        <div>
          <a href={`/video/${video._id}`} style={{ color: "gray" }}>
            <span style={{ fontSize: "1rem", color: "black" }}>
              {video.title}
            </span>
            <br /> <span>{video.title}</span>
            <span>{video.views} views</span> <br />
            <span>
              {" "}
              {minutes}:{seconds}{" "}
            </span>{" "}
            <br />
          </a>
        </div>
      </div>
    );
  });

  return (
    <div>
      <React.Fragment>
        <div style={{ marginTop: "3rem" }}>{renderSideVideo}</div>
      </React.Fragment>
    </div>
  );
}

export default SideVideo;
