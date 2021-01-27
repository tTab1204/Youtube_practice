const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscriberSchema = mongoose.Schema(
  {
    userTo: {
      // 아래에 이건 결국 외래키에 해당하는걸까? 정확히는 모르겠다.
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    userFrom: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Subscriber = mongoose.model("Subscriber", subscriberSchema);

module.exports = { Subscriber };
