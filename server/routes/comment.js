const express = require("express");
const router = express.Router();

const { Comment } = require("../models/Comment");

//=================================
//             subscribe
//=================================

// 댓글을 DB에 저장
router.post("/saveComment", (req, res) => {
  const comment = new Comment(req.body);

  comment.save((err, comment) => {
    if (err) return res.status(400).json({ success: false, err });

    // 저장된 comment의 id로 Comment DB의 각 댓글 별 id를 찾는다.
    Comment.find({ _id: comment._id })
      .populate("writer")
      .exec((err, result) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({ success: true, result });
      });
  });
});

// 모든 댓글 목록 보여주기
router.post("/showComments", (req, res) => {
  Comment.find({ videoId: req.body.videoId })
    .populate("writer")
    .exec((err, comments) => {
      if (err) res.status(400).send(err);
      res.status(200).json({ success: true, comments });
    });
});

// 댓글 삭제 기능
router.post("/deleteComment", (req, res) => {
  // 먼저 내가 지우려고 하는 댓글 지워주기

  Comment.findOneAndDelete({
    _id: req.body.commentId,
  }).exec((err, deletedId) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true, deletedId });
  });
});

module.exports = router;
