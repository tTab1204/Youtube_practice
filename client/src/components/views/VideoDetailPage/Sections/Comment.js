import React, { useState, useEffect } from "react";
import { Input, Button } from "antd";
import Axios from "axios";
import { useSelector } from "react-redux";
import SingleComment from "./SingleComment";
import ReplyComment from "./ReplyComment";

const { TextArea } = Input;

function Comment(props) {
  const [CommentValue, setCommentValue] = useState("");
  const [Comments, setComments] = useState([]);

  const user = useSelector((state) => state.user);

  const handleClick = (e) => {
    setCommentValue(e.currentTarget.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      writer: user.userData._id,
      videoId: props.videoId,
      content: CommentValue,
    };

    Axios.post("/api/comment/saveComment", variables).then((response) => {
      if (response.data.success) {
        setCommentValue("");
        // 자식 컴포넌트에서 부모 컴포넌트로
        // refreshFunction이라는 함수를 이용하여
        // 값을 넘겨준다.
        props.refreshFunction(response.data.result);
      } else {
        alert("저장은 됐는데 왜 console 창에 안 찍힐까요?");
      }
    });
  };

  return (
    <div>
      <br />
      <p> 댓글 </p>
      <hr />

      {props.commentList &&
        props.commentList.map(
          (comment, index) =>
            !comment.responseTo && (
              <React.Fragment key={comment._id}>
                <SingleComment
                  refreshFunction={props.refreshFunction}
                  comment={comment}
                  videoId={props.videoId}
                  showComments={props.showComments}
                />
                <ReplyComment
                  refreshFunction={props.refreshFunction}
                  commentList={props.commentList}
                  videoId={props.videoId}
                  parentCommentId={comment._id}
                  showComments={props.showComments}
                />
              </React.Fragment>
            )
        )}

      {/* 댓글 작성 공간 */}
      <form style={{ display: "flex" }} onSubmit={onSubmit}>
        <TextArea
          style={{ width: "100%", borderRadius: "5px" }}
          placeholder="공개 댓글 추가..."
          value={CommentValue}
          onChange={handleClick}
        />
        <br />

        <Button style={{ width: "20%", height: "52px" }} onClick={onSubmit}>
          댓글
        </Button>
      </form>
    </div>
  );
}

export default Comment;
