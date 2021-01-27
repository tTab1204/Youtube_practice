import React, { useEffect, useState } from "react";
import { Tooltip, Icon } from "antd";
import Axios from "axios";

function LikeDislikes(props) {
  const [Likes, setLikes] = useState(0);
  const [Dislikes, setDislikes] = useState(0);
  const [LikeAction, setLikeAction] = useState(null);
  const [DislikeAction, setDislikeAction] = useState(null);

  let variables = {};

  if (props.videoId) {
    variables = {
      videoId: props.videoId,
      userId: props.userId,
    };
  } else {
    variables = {
      commentId: props.commentId,
      userId: props.userId,
    };
  }

  useEffect(() => {
    // 좋아요 갯수
    Axios.post("/api/like/numberOfLikes", variables).then((response) => {
      if (response.data.success) {
        setLikes(response.data.likes.length);
      } else {
        alert("좋아요 갯수를 받아오지 못했습니다.");
      }
    });

    // 싫어요 갯수
    Axios.post("/api/like/numberOfDislikes", variables).then((response) => {
      if (response.data.success) {
        setDislikes(response.data.dislikes.length);
      } else {
        alert("싫어요 갯수를 받아오지 못했습니다.");
      }
    });
  }, []);

  // 좋아요 누를때 액션
  const onLike = () => {
    //좋아요가 눌리지 않은 상황이라면?
    if (LikeAction === null) {
      Axios.post("/api/like/upLike", variables).then((response) => {
        if (response.data.success) {
          setLikes(Likes + 1);
          setLikeAction("liked");

          // 만약 싫어요가 이미 눌린 상황이라면?
          if (DislikeAction !== null) {
            setDislikeAction(null);
            setDislikes(Dislikes - 1);
          }
        } else {
          alert("Like를 올리지 못하였습니다.");
        }
      });

      // 그럼 반대로 좋아요가 눌려 있는 상황이라면?
    } else {
      Axios.post("/api/like/unLike", variables).then((response) => {
        if (response.data.success) {
          setLikes(Likes - 1);
          setLikeAction(null);
        } else {
          alert("Like를 내리지 못하였습니다.");
        }
      });
    }
  };

  // 싫어요 누를때 액션
  const onDislike = () => {
    //싫어요가 눌리지 않은 상황이라면?
    if (DislikeAction === null) {
      Axios.post("/api/like/upDislike", variables).then((response) => {
        if (response.data.success) {
          setDislikes(Dislikes + 1);
          setDislikeAction("disliked");

          // 만약 좋아요가 이미 눌린 상황이라면?
          if (LikeAction !== null) {
            setLikeAction(null);
            setLikes(Likes - 1);
          }
        } else {
          alert("Dislike를 올리지 못하였습니다.");
        }
      });

      // 그럼 반대로 싫어요가 눌려 있는 상황이라면?
    } else {
      Axios.post("/api/like/unDislike", variables).then((response) => {
        if (response.data.success) {
          setDislikes(Dislikes - 1);
          setDislikeAction(null);
        } else {
          alert("Dislike를 내리지 못하였습니다.");
        }
      });
    }
  };

  return (
    <div>
      <span key="comment-basic-like">
        <Tooltip title="좋아요">
          <Icon
            type="like"
            theme={LikeAction === "liked" ? "filled" : "outlined"}
            onClick={onLike}
          />
        </Tooltip>
        <span style={{ paddingLeft: "6px", cursor: "auto" }}>{Likes}</span>
      </span>
      <span key="comment-basic-dislike" style={{ marginLeft: "8px" }}>
        <Tooltip title="싫어요">
          <Icon
            type="dislike"
            theme={DislikeAction === "disliked" ? "filled" : "outlined"}
            onClick={onDislike}
          />
        </Tooltip>
        {/* <span style={{ paddingLeft: "6px", cursor: "auto" }}>싫어요</span> */}
        <span style={{ paddingLeft: "6px", cursor: "auto" }}>{Dislikes}</span>
      </span>
      &nbsp;&nbsp;
    </div>
  );
}

export default LikeDislikes;
