import React, { useEffect, useState } from "react";
import { List, Avatar, Row, Col, message } from "antd";
import SideVideo from "./Sections/SideVideo";
import Subscribe from "./Sections/Subscribe";
import Comment from "./Sections/Comment";
import CorrectVideo from "./Sections/CorrectVideo";
import LikeDislikes from "./Sections/LikeDislikes";
import Axios from "axios";

function VideoDetailPage(props) {
  const [VideoDetail, setVideoDetail] = useState(Object);
  const [Comments, setComments] = useState([]);
  const [SubscribeNumber, setSubscribeNumber] = useState(0);
  const [Views, setViews] = useState(0);

  const videoId = props.match.params.videoId;

  // post 형식에서는 variable처럼 반드시 객체에 담아서 보내야만 하나보다..
  // 그냥 videoId를 보냈더니 videoDetail이 null값이 뜬다.
  const variables = {
    videoId: videoId,
  };

  const showComments = () => {
    Axios.post("/api/comment/showComments", variables).then((response) => {
      if (response.data.success) {
        setComments(response.data.comments);
      } else {
        alert("비디오에 해당하는 코멘트 정보를 가져오지 못했습니다!");
      }
    });
  };

  useEffect(() => {
    Axios.post("/api/video/showVideoDetail", variables).then((response) => {
      if (response.data.success) {
        setVideoDetail(response.data.videoDetail);
      } else {
        alert("비디오 정보를 가져오는 데 실패했습니다..");
      }

      // 이 비디오에 있는 모든 댓글 가져오기
      // setComments에 의해 모든 댓글이 Comments에 저장된다.
      showComments(variables);
    });

    Axios.post("/api/video/updateViews", variables).then((response) => {
      if (response.data.success) {
        setViews(response.data.views);
      } else {
        console.log("조회수를 올리는데 실패하였습니다.");
      }
    });
  }, []);

  // 자식 컴포넌트에서 보낸 response.data.result(Comments)를
  // 여기서 newComments로 받아준다.
  const refreshFunction = (newComments) => {
    setComments(Comments.concat(newComments));
  };

  // const refreshDeleteFunction = (deletedComments) => {
  //   setComments(Comments.filter((comment) => comment._id !== deletedComments));
  // };

  const getSubscribeNumber = (newSubscribeNumber) => {
    setSubscribeNumber(newSubscribeNumber);
  };

  if (VideoDetail.writer) {
    const subscribeButton = VideoDetail.writer._id !==
      localStorage.getItem("userId") && (
      <Subscribe
        userTo={VideoDetail.writer._id}
        userFrom={localStorage.getItem("userId")}
        getSubscribeNumber={getSubscribeNumber}
      />
    );

    return (
      <Row gutter={[16, 16]}>
        <Col lg={18} xs={24}>
          <div style={{ width: "100%", padding: "3rem 4rem" }}>
            <video
              style={{ width: "100%" }}
              src={`http://localhost:5000/${VideoDetail.filePath}`}
              controls
            />

            <List.Item
              // ant design에서 action부분을 배열로 해놓았기 때문에 배열 안에 컴포넌트를 집어 넣는다.
              actions={[
                <LikeDislikes
                  userId={localStorage.getItem("userId")}
                  videoId={videoId}
                />,
                subscribeButton,
              ]}
            >
              <List.Item.Meta
                // 이미지 정보를 가져오기 전에 화면이 렌더링 된다.
                // 그래서 오류가 떴었음.
                // 자주 발생하는 오류니까 기억해두자.
                avatar={<Avatar src={VideoDetail.writer.image} />}
                title={VideoDetail.writer.name}
                description={`구독자 ${SubscribeNumber}명`}
              />
              <CorrectVideo
                writerId={VideoDetail.writer._id}
                userId={localStorage.getItem("userId")}
                videoId={videoId}
              />

              <span style={{ marginLeft: "40px" }}>조회수 {Views}회</span>
            </List.Item>

            {/* Comments */}

            <Comment
              showComments={showComments}
              refreshFunction={refreshFunction}
              commentList={Comments}
              videoId={videoId}
            />
          </div>
        </Col>
        {/* SideVideo */}
        <Col lg={6} xs={24}>
          <SideVideo />
        </Col>
      </Row>
    );
  } else {
    return <div>Loading...</div>;
  }
}

export default VideoDetailPage;
