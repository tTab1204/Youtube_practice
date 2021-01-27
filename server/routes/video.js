const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { Video } = require("../models/Video");
const { Subscriber } = require("../models/Subscriber");
const { auth } = require("../middleware/auth");
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");

//=================================
//             video
//=================================

let storage = multer.diskStorage({
  // destination: 어디에 파일을 저장할 지
  destination: (req, file, cb) => {
    // destination: VideoUploads폴더가 된다. VideoUploads 폴더에 비디오 저장.
    cb(null, "VideoUploads/");
  },
  // 파일 이름
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  // 파일 형식은 mp4만, 즉 동영상만 가능
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".mp4") {
      return cb(res.status(400).end("only mp4 is allowed"), false);
    }
    cb(null, true);
  },
});

const upload = multer({ storage: storage }).single("file");

// Dropzone에 비디오 파일 업로드
router.post("/uploadfiles", (req, res) => {
  // 비디오를 서버에 저장한다.
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }

    return res.json({
      success: true,
      url: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

// 썸네일 생성
router.post("/thumbnail", (req, res) => {
  // 썸네일 생성하고 비디오 러닝타임도 가져오기

  let filePath = "";
  let fileDuration = "";

  // 비디오 관련 많은정보를 가져오기 위함(시간정보 포함, fileDuration같은).
  ffmpeg.ffprobe(req.body.url, function (err, metadata) {
    console.dir(metadata);
    console.log(metadata.format.duration);

    fileDuration = metadata.format.duration;
  });
  // 썸네일 생성
  ffmpeg(req.body.url)
    // 파일이름 생성
    .on("filenames", function (filenames) {
      console.log("Will generate " + filenames.join(", "));

      //파일 경로
      filePath = "VideoUploads/thumbnails/" + filenames[0];
    })
    // 썸네일 생성이 끝나면 뭘 할 것인지
    .on("end", function () {
      console.log("Screenshots taken");
      // 썸네일 생성 했을 떄 client로 보내주는 정보들
      return res.json({
        success: true,
        url: filePath,
        fileDuration: fileDuration,
      });
    })
    .on("error", function (err) {
      console.log(err);
      return res.json({ success: false, err });
    })
    .screenshots({
      // Will take screens at 20%, 40%, 60% and 80% of the video
      // 찍을 수 있는 썸네일의 갯수
      count: 1,
      // 폴더명
      folder: "VideoUploads/thumbnails",
      size: "320x240",
      // %b input basename ( filename w/o extension )
      filename: "thumbnail-%b.png",
    });
});

// 비디오 전체 정보 업로드
router.post("/uploadVideo", (req, res) => {
  // 왜 여기서는 따로 video라는 객체에 저장하는걸까?
  // Video.find같이는 왜 안하는걸까?
  const video = new Video(req.body);

  video.save((err, doc) => {
    if (err) return res.send(err);
    res.status(200).json({ success: true, doc });
  });
});

router.post("/correct/uploadVideo", (req, res) => {

  const video = new Video(req.body);

  Video.findById(req.body.videoId)
    .populate("writer")
    .exec((err, updatedVideo) => {
      if (err) return res.status(400).json({ success: false, err });
      updatedVideo.save((err, doc) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({ success: true, updatedVideo });
        console.log(updatedVideo);
      });
    });
});

// 1. 비디오를 랜딩 페이지 화면에 나타내기
// 2. 사이드 비디오에 넣을 정보 불러오기
router.get("/getVideos", (req, res) => {
  Video.find()
    .populate("writer")
    .exec((err, videos) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, videos });
    });
});

// 비디오 디테일 페이지의 비디오 정보 불러오기
router.post("/showVideoDetail", (req, res) => {
  Video.findOne({ _id: req.body.videoId })
    .populate("writer")
    .exec((err, videoDetail) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, videoDetail });
    });
});

// 자기가 구독한 사람의 비디오를 모두 불러오기
router.post("/showSubscribedVideo", (req, res) => {
  // 자신의 userFrom(아이디)를 이용하여 구독 중인 사람들을 찾는다.
  Subscriber.find({ userFrom: req.body.userFrom }).exec(
    (err, subscriberInfo) => {
      if (err) return res.status(400).json({ success: false, err });

      let subscribedUser = [];
      subscriberInfo.map((subscriber, index) => {
        subscribedUser.push(subscriber.userTo);
      });

      // 찾은 사람들의 비디오를 가지고 온다.

      Video.find({
        // 한 명이 아닌 여러 명(userTo)의 정보를 가져와야 하기 때문에 $in 사용.
        writer: { $in: subscribedUser },
      })
        .populate("writer")
        .exec((err, videos) => {
          if (err) return res.status(400).json({ success: false, err });
          res.status(200).json({ success: true, videos });
        });
    }
  );
});

// 조회수 증가 기능
router.post("/updateViews", (req, res) => {
  // 해당 비디오 아이디에 맞는 비디오를 찾은 뒤
  Video.findById(req.body.videoId)
    .populate("writer")
    .exec((err, video) => {
      if (err) return res.status(400).json({ success: false, err });
      video.views++;
      // 조회수 정보를 저장
      video.save((err, doc) => {
        if (err) return res.status(400).json({ success: false, err });

        res.status(200).json({ success: true, views: video.views });
      });
    });
});

module.exports = router;

// throw new TypeError('Router.use() requires a middleware function but got a ' + gettype(fn))
// 보통 module.exports = router; 이게 빠진 경우다.
