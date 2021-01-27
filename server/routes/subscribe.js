const express = require("express");
const router = express.Router();

const { Subscriber } = require("../models/Subscriber");

//=================================
//             subscribe
//=================================

// 구독자 수 정보
router.post("/subscriberNumber", (req, res) => {
  Subscriber.find({ userTo: req.body.userTo }).exec((err, subscribe) => {
    if (err) return res.status(400).send(err);
    return res
      .status(200)
      .json({ success: true, subscribeNumber: subscribe.length });
  });
});

// 구독을 했는지 안 했는지 여부
router.post("/subscribed", (req, res) => {
  Subscriber.find({
    userTo: req.body.userTo,
    userFrom: req.body.userFrom,
  }).exec((err, info) => {
    if (err) return res.status(400).send(err);

    let result = false;
    // 만약 info배열의 길이가 0이 아니라면 구독자가 있다는 소리니까
    // result를 true로 바꿔준다.
    if (info.length !== 0) {
      result = true;
    }
    res.status(200).json({ success: true, subscribed: result });
  });
});

// 구독 취소 기능
router.post("/unSubscribe", (req, res) => {
  Subscriber.findOneAndDelete({
    userTo: req.body.userTo,
    userFrom: req.body.userFrom,
  }).exec((err, result) => {
    if (err) return res.status(400).send(err);
    res.status(200).json({ success: true, result });
  });
});

// 구독 성공 기능
router.post("/onSubscribe", (req, res) => {
  const subscribe = new Subscriber(req.body);

  subscribe.save((err, result) => {
    if (err) return res.status(400).send(err);
    res.status(200).json({ success: true, result });
  });
});

module.exports = router;
