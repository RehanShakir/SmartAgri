import { Menu, Upload, message, Button, Form, Input, Divider } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React, { useState } from "react";

import { NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import smartAgri from "../../api/smartAgri";
import { store, useGlobalState } from "state-pool";

function Sidenav({ color }) {
  const { pathname } = useLocation();
  const page = pathname.replace("/", "");
  const [dta, setDta] = useState(null);
  const [re1, setRe1] = useState(null);
  const [uploadList, setUploadList] = useState(true);

  const [handleRe1Data, setHandleR1Data] = useGlobalState("handleRe1");
  const [handleRe2Data, setHandleR2Data] = useGlobalState("handleRe2");
  const [handleRe3Data, setHandleR3Data] = useGlobalState("handleRe3");
  const [handleMsg, setHandleMsg] = useGlobalState("handleMsg");

  const uploadFile = () => {
    const data = new FormData();

    data.append("file", dta);

    smartAgri
      .post("/api/fileUpload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        setUploadList(false);

        message.success("Upload Successfully");
      })
      .catch((err) => {
        console.log("In err");
        setUploadList(false);
        message.error("Cant Upload");
        console.log(err);
      });
  };

  const tables = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M9 2C8.44772 2 8 2.44772 8 3C8 3.55228 8.44772 4 9 4H11C11.5523 4 12 3.55228 12 3C12 2.44772 11.5523 2 11 2H9Z"
        fill={color}
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 5C4 3.89543 4.89543 3 6 3C6 4.65685 7.34315 6 9 6H11C12.6569 6 14 4.65685 14 3C15.1046 3 16 3.89543 16 5V16C16 17.1046 15.1046 18 14 18H6C4.89543 18 4 17.1046 4 16V5ZM7 9C6.44772 9 6 9.44772 6 10C6 10.5523 6.44772 11 7 11H7.01C7.56228 11 8.01 10.5523 8.01 10C8.01 9.44772 7.56228 9 7.01 9H7ZM10 9C9.44772 9 9 9.44772 9 10C9 10.5523 9.44772 11 10 11H13C13.5523 11 14 10.5523 14 10C14 9.44772 13.5523 9 13 9H10ZM7 13C6.44772 13 6 13.4477 6 14C6 14.5523 6.44772 15 7 15H7.01C7.56228 15 8.01 14.5523 8.01 14C8.01 13.4477 7.56228 13 7.01 13H7ZM10 13C9.44772 13 9 13.4477 9 14C9 14.5523 9.44772 15 10 15H13C13.5523 15 14 14.5523 14 14C14 13.4477 13.5523 13 13 13H10Z"
        fill={color}
      ></path>
    </svg>,
  ];

  const publishToMqtt = (topic, msg) => {
    let macaddress = localStorage.getItem("macAddress");

    smartAgri
      .post(`/api/mqtt/publish/${macaddress}/${topic}`, {
        message: msg,
      })
      .then((res) => {
        console.log(res);
        setUploadList(false);

        message.success("Message Published");
      })
      .catch((err) => {
        console.log("In err");
        setUploadList(false);
        message.error("Cant Upload");
        console.log(err);
      });
  };
  const handleRe1 = () => {
    publishToMqtt("relay", "1");

    // localStorage.setItem("relay1Btn","")
    handleRe1Data();
  };

  // store.setState("relay1", handleRe1Data);
  const handleRe2 = () => {
    publishToMqtt("relay", "2");

    handleRe2Data();
    // if (relay2On) {
    //   setRelay2N(true);
    //   localStorage.setItem(`${localStorage.getItem("macAddress")}Relay2`, "on");
    //   relay2On = false;
    // } else {
    //   localStorage.setItem(
    //     `${localStorage.getItem("macAddress")}Relay2`,
    //     "off"
    //   );
    //   setRelay2N(false);
    //   relay2On = true;
    // }
  };
  const handleRe3 = () => {
    publishToMqtt("relay", "3");
    handleRe3Data();
    // if (relay3On) {
    //   setRelay3N(true);
    //   localStorage.setItem(`${localStorage.getItem("macAddress")}Relay3`, "on");
    //   relay3On = false;
    // } else {
    //   localStorage.setItem(
    //     `${localStorage.getItem("macAddress")}Relay3`,
    //     "off"
    //   );
    //   setRelay3N(false);
    //   relay3On = true;
    // }
  };
  const onFinish = (values) => {
    // console.log(values.settings);
    publishToMqtt("settings", values.settings);
    handleMsg();
  };

  const onFinishFailed = () => {};
  const beforeUpload = (file) => {
    console.log(file);
    setDta(file);
    console.log("INFOLEreder");

    return false;
  };

  const btnPublish = {
    marginTop: "20px",
    // marginLeft: "0px",
    borderRadius: "50px",
    width: "100%",
  };
  return (
    <>
      <div className="brand">
        <img src={logo} alt="" />
        <span>Smart Agri</span>
      </div>
      <hr />
      <Menu theme="light" mode="inline">
        <Menu.Item key="2">
          <NavLink to="/tables">
            <span
              className="icon"
              style={{
                background: page === "tables" ? color : "",
              }}
            >
              {tables}
            </span>
            <span className="label">Data</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="4">
          <Form name="file-upload-form" onFinish={uploadFile}>
            <Form.Item name="file">
              <Upload beforeUpload={beforeUpload} showUploadList={uploadList}>
                <Button
                  style={{
                    marginTop: "50px",
                    marginLeft: "20px",
                    borderRadius: "50px",
                  }}
                  icon={<UploadOutlined />}
                >
                  Click to Upload
                </Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%", borderRadius: "50px" }}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Menu.Item>
      </Menu>
      <Divider style={{ marginTop: "5px" }} />

      <Button type="primary" style={btnPublish} onClick={handleRe1}>
        Relay 1
      </Button>
      <Button type="primary" style={btnPublish} onClick={handleRe2}>
        Relay 2
      </Button>
      <Button type="primary" style={btnPublish} onClick={handleRe3}>
        Relay 3
      </Button>
      <Divider style={{ marginTop: "40px" }} />
      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        className="row-col"
      >
        <Form.Item
          className="username"
          label=""
          name="settings"
          rules={[
            {
              required: true,
              message: "Please Enter Settings",
            },
          ]}
        >
          <Input
            placeholder="Enter Settings"
            style={{ width: "100%", borderRadius: "50px", marginTop: "20px" }}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={btnPublish}
            // onClick={executeScroll}
            // style={{ marginTop: "0px", borderRadius: "50px", width: "100%" }}
          >
            Send Settings
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default Sidenav;
