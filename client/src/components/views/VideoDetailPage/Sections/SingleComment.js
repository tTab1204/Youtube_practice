import React, { useState, useEffect } from "react";
import { Comment, Avatar, Button, Input } from "antd";
import Axios from "axios";
import { useSelector } from "react-redux";
import LikeDislikes from "./LikeDislikes";

const { TextArea } = Input;

function SingleComment(props) {
  const [CommentValue, setCommentValue] = useState("");
  const [OpenReply, setOpenReply] = useState(false);

  const user = useSelector((state) => state.user);

  const onHandleChange = (e) => {
    setCommentValue(e.currentTarget.value);
  };

  const OpenReplyHandler = (e) => {
    setOpenReply(!OpenReply);
  };

  // 댓글 수정 기능

  // 댓글삭제 기능
  const DeleteHandler = (targetedCommentId) => {
    let confirmRes = window.confirm("정말 이 글을 삭제하시길 원하시나요 ?");

    if (confirmRes) {
      let variables = {
        commentId: targetedCommentId,
      };

      Axios.post("/api/comment/deleteComment", variables).then((response) => {
        if (response.data.success) {
          props.refreshDeleteFunction(response.data.deletedCommentId);
        } else {
          alert("댓글 삭제에 실패하였습니다.");
        }
      });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    let variables = {
      writer: user.userData._id,
      videoId: props.videoId,
      content: CommentValue,
      responseTo: props.comment._id,
    };

    Axios.post("/api/comment/saveComment", variables).then((response) => {
      if (response.data.success) {
        setCommentValue("");
        setOpenReply(false);
        props.refreshFunction(response.data.result);
      } else {
        alert("댓글 저장에 실패하였습니다.");
      }
    });
  };

  const actions = [
    <LikeDislikes
      userId={localStorage.getItem("userId")}
      commentId={props.comment._id}
    />,

    <span onClick={OpenReplyHandler} key="comment-basic-reply-to">
      답글 달기
    </span>,
    <span>수정</span>,
    <span onClick={() => DeleteHandler(props.comment._id)}>삭제</span>,
    //<span onClick={DeleteHandler}>삭제</span>,
  ];

  return (
    <div>
      {props.comment.writer && (
        <Comment
          actions={actions}
          author={props.comment.writer.name}
          avatar={<Avatar src={props.comment.writer.image} alt="avatar" />}
          content={<p>{props.comment.content}</p>}
        ></Comment>
      )}
      {OpenReply && (
        <form style={{ display: "flex" }} onSubmit={onSubmit}>
          <TextArea
            style={{ width: "100%", borderRadius: "5px" }}
            onChange={onHandleChange}
            value={CommentValue}
            placeholder="코멘트를 작성해주세요."
          />
          <br />
          <Button style={{ width: "20%", height: "52px" }} onClick={onSubmit}>
            댓글
          </Button>
        </form>
      )}
    </div>
  );
}

export default SingleComment;
