import React, { useState, useEffect } from "react";
import { Typography, Button, Form, message, Input, Icon } from "antd";
import Dropzone from "react-dropzone";
import { useSelector } from "react-redux";
import { Select } from "antd";
import Axios from "axios";

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const PrivateOptions = [
  { value: 0, label: "개인용" },
  { value: 1, label: "공용" },
];

const CategoryOptions = [
  { value: 0, label: "필름 & 애니메이션" },
  { value: 1, label: "자동차" },
  { value: 2, label: "게임" },
  { value: 3, label: "음악" },
  { value: 4, label: "애완동물" },
  { value: 5, label: "음식" },
];

function VideoUploadPage(props) {
  const [VideoTitle, setVideoTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Private, setPrivate] = useState(0);
  const [Category, setCategory] = useState(0);
  const [FilePath, setFilePath] = useState("");
  const [ThumbnailPath, setThumbnailPath] = useState("");
  const [Duration, setDuration] = useState("");

  const user = useSelector((state) => state.user);

  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    formData.append("file", files[0]);

    Axios.post("/api/video/uploadfiles", formData, config).then((response) => {
      if (response.data.success) {
        setFilePath(response.data.url);

        let variable = {
          url: response.data.url,
          fileName: response.data.fileName,
        };

        Axios.post("/api/video/thumbnail", variable).then((response) => {
          if (response.data.success) {
            setDuration(response.data.fileDuration);
            setThumbnailPath(response.data.url);
          } else {
            alert("썸네일 생성에 실패했습니다.");
          }
        });
      } else {
        alert("비디오 업로드를 실패했습니다.");
      }
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // Video Collection에 들어갈 모든 정보를 보내줌.
    let variables = {
      // 얘는 redux에서 가져옴.
      writer: user.userData._id,
      title: VideoTitle,
      description: Description,
      privacy: Private,
      filePath: FilePath,
      category: Category,
      duration: Duration,
      thumbnail: ThumbnailPath,
    };

    Axios.post("/api/video/uploadVideo", variables).then((response) => {
      if (response.data.success) {
        const key = "updatable";
        message.loading({ content: "Loading...", key });
        // setTimeout: 시간을 주고 처리를 할 수 있게 한다.
        setTimeout(() => {
          message.success({
            content: "성공적으로 업로드를 했습니다.",
            key,
            duration: 2,
          });
          props.history.push("/");
        }, 2000);
      } else {
        alert("비디오 업로드에 실패하였습니다.");
      }
    });
  };

  const onTitleChange = (e) => {
    setVideoTitle(e.currentTarget.value);
  };

  const onDescriptionChange = (e) => {
    setDescription(e.currentTarget.value);
  };

  const onPrivateChange = (e) => {
    setPrivate(e.currentTarget.value);
  };

  const onCategoryChange = (e) => {
    setCategory(e.currentTarget.value);
  };

  return (
    //  margin: /* 세로방향 | 가로방향 */
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div
        style={{
          textAlign: "center",
          marginBottom: "2rem",
        }}
      >
        <Title level={2}>Upload Video</Title>
      </div>
      <Form onSubmit={onSubmit}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Dropzone
            accept="video/*"
            onDrop={onDrop}
            ultiple={false}
            maxSize={800000000}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                style={{
                  width: "300px",
                  height: "240px",
                  border: "1px solid lightgray",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <input {...getInputProps()} />
                <Icon type="plus" style={{ fontSize: "3rem" }} />
              </div>
            )}
          </Dropzone>

          {/* Thumbnail */}
          {ThumbnailPath && (
            <div>
              <img
                src={`http://localhost:5000/${ThumbnailPath}`}
                alt="thumbnail"
              />
            </div>
          )}
        </div>

        <br />
        <br />

        {/* Title */}
        <label>Title</label>
        <Input onChange={onTitleChange} value={VideoTitle} />

        <br />
        <br />

        {/* TextArea */}
        <label>Description</label>
        <TextArea onChange={onDescriptionChange} value={Description} />

        <br />
        <br />

        <select onChange={onPrivateChange}>
          {PrivateOptions.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <br />
        <br />

        <select onChange={onCategoryChange}>
          {CategoryOptions.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <br />
        <br />

        <Button type="primary" size="large" onClick={onSubmit}>
          업로드하기
        </Button>
      </Form>
    </div>
  );
}

export default VideoUploadPage;
