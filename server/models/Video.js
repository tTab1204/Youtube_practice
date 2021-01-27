const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const videoSchema = mongoose.Schema(
  {
    writer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      maxlength: 50,
    },
    description: {
      type: String,
    },
    privacy: {
      type: Number,
    },
    filePath: {
      type: String,
    },
    category: {
      type: Number,
    },
    views: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    //timestamps가 true이면 데이터를 만든 date과 업데이트한 date이 표시가 된다.
  },
  { timestamps: true }
);

const Video = mongoose.model("Video", videoSchema);

module.exports = { Video };
