const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require("./config/key");

// const mongoose = require("mongoose");
// mongoose
//   .connect(config.mongoURI, { useNewUrlParser: true })
//   .then(() => console.log("DB connected"))
//   .catch(err => console.error(err));

const mongoose = require("mongoose");
const connect = mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected!!"))
  .catch((err) => console.log(err));

app.use(cors());

//to not get any deprecation warning or error
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
//to get json data
// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/users", require("./routes/users"));
app.use("/api/video", require("./routes/video"));
app.use("/api/subscribe", require("./routes/subscribe"));
app.use("/api/comment", require("./routes/comment"));
app.use("/api/like", require("./routes/like"));
//use this to show the image you have in node js server to client (react js)
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client
// client에서  back서버에 있는 static한 파일들을 (이미지, css 파일, javascript 파일) 처리하려면  이렇게 해야 한다.
// 정확히 어떻게 기능하는지는 모르겠음.
app.use("/VideoUploads", express.static("VideoUploads"));

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  // All the javascript and css files will be read and served from this folder
  app.use(express.static("client/build"));

  // index.html for all page routes    html or routing and naviagtion
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server Listening on ${port}`);
});
