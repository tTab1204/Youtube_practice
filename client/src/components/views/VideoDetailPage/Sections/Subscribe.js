import React, { useEffect, useState } from "react";
import { Button, message, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Axios from "axios";

function Subscribe(props) {
  const [SubscriberNumber, setSubscriberNumber] = useState(0);
  const [Subscribed, setSubscribed] = useState(false);
  const [Loading, setLoading] = useState(true);

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  useEffect(() => {
    const variable = {
      userTo: props.userTo,
    };

    //구독자 수를 알기 위해서
    Axios.post("/api/subscribe/subscriberNumber", variable).then((response) => {
      if (response.data.success) {
        setSubscriberNumber(response.data.subscribeNumber);
        props.getSubscribeNumber(response.data.subscribeNumber);
        setLoading(false);
      } else {
        alert("구독자 수 정보를 가져오지 못했습니다.");
      }
    });

    const subscribedvariable = {
      userTo: props.userTo,
      userFrom: props.userFrom,
    };

    // 구독 했는지 안 했는지를 알기 위해서
    Axios.post("/api/subscribe/subscribed", subscribedvariable).then(
      (response) => {
        if (response.data.success) {
          setSubscribed(response.data.subscribed);
        } else {
          alert("구독 했는지 안 했는지 확인에 실패했습니다.");
        }
      }
    );
  }, []);

  const onSubscribe = () => {
    // SubScribed가 true라면 이미 구독중이라는 뜻
    // 그러니까 구독 해지를 눌러야겠지?

    const variables = {
      userTo: props.userTo,
      userFrom: props.userFrom,
    };

    if (Subscribed) {
      Axios.post("/api/subscribe/unSubscribe", variables).then((response) => {
        if (response.data.success) {
          setSubscriberNumber(SubscriberNumber - 1);
          setSubscribed(!Subscribed);
        } else {
          alert("구독 취소하는데 실패하였습니다.");
        }
      });
    } else {
      Axios.post("/api/subscribe/onSubscribe", variables).then((response) => {
        if (response.data.success) {
          setSubscriberNumber(SubscriberNumber + 1);
          setSubscribed(!Subscribed);
        } else {
          alert("구독 하는데 실패하였습니다.");
        }
      });
    }
  };

  if (Loading) {
    return (
      <div>
        <button
          style={{
            borderRadius: "4px",
            color: "white",
            padding: "10px 16px",
            fontWeight: "500",
            fontSize: "1rem",
            textTransform: "uppercase",
          }}
          onClick={onSubscribe}
        >
          <Spin indicator={antIcon} />
        </button>
      </div>
    );
  } else {
    return (
      <div>
        <button
          style={{
            backgroundColor: `${Subscribed ? "#AAAAAA" : "#CC0000"}`,
            borderRadius: "4px",
            color: "white",
            padding: "10px 16px",
            fontWeight: "500",
            fontSize: "1rem",
            textTransform: "uppercase",
          }}
          onClick={onSubscribe}
        >
          {Subscribed ? `구독중` : "구독하기"}
        </button>
      </div>
    );
  }
}

export default Subscribe;
