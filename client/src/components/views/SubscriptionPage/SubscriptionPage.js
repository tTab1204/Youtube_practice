import React, { useEffect, useState } from "react";
import { FaCode } from "react-icons/fa";
import { Card, Avatar, Col, Typography, Row, message } from "antd";
import Axios from "axios";
import moment from "moment";

const { Title } = Typography;
const { Meta } = Card;

function SubscriptionPage() {
  const [Video, setVideo] = useState([]);

  useEffect(() => {
    const subscriptionVariables = {
      userFrom: localStorage.getItem("userId"),
    };

    Axios.post("/api/video/showSubscribedVideo", subscriptionVariables).then(
      (response) => {
        if (response.data.success) {
          setVideo(response.data.videos);
          console.log(response.data.videos);
        } else {
          alert("비디오 정보를 가져오지 못하였습니다.");
        }
      }
    );
  }, []);

  const renderCards = Video.map((video, index) => {
    let minutes = Math.floor(video.duration / 60);
    let seconds = Math.floor(video.duration - minutes * 60);

    return (
      <Col key={index} lg={6} md={8} xs={24}>
        <a href={`/video/${video._id}`}>
          <div style={{ position: "relative" }}>
            <img
              style={{ width: "100%" }}
              src={`http://localhost:5000/${video.thumbnail}`}
              alt="thumbnail"
            />

            <div
              className="duration"
              style={{
                bottom: 0,
                right: 0,
                position: "absolute",
                margin: "4px",
                color: "#fff",
                backgroundColor: "rgba(17, 17, 17, 0.8)",
                opacity: 0.8,
                padding: "2px 4px",
                borderRadius: "2px",
                letterSpacing: "0.5px",
                fontSize: "12px",
                fontWeight: "500",
                lineHeight: "12px",
              }}
            >
              <span>
                {minutes} : {seconds}
              </span>
            </div>
          </div>
        </a>
        <br />
        <Meta
          avatar={<Avatar src={video.writer.image} />}
          title={video.title}
          description={video.writer.name}
        />
        <br />
        <span style={{ marginLeft: "3rem", marginRight: "1rem" }}>
          {" "}
          {video.views} views
        </span>{" "}
        {/* moment: 날짜 관련 작업 쉽게 하는 함수 */}
        <span>{moment(video.creatdAt).format("MM-DD-YYYY")} </span>
      </Col>
    );
  });

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <Title level={4}> 구독 중인 영상 </Title>
      <hr />
      <Row gutter={[32, 16]}> {renderCards}</Row>
    </div>
  );
}

export default SubscriptionPage;
