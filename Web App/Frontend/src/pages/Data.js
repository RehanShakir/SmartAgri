import "../assets/styles/main.css";
import React, { useEffect, useState, useRef } from "react";
import history from "../utils/CreateBrowserHistory";
import LineChart from "../components/chart/LineChart";

import smartAgri from "../api/smartAgri";
import {
  Row,
  Col,
  Card,
  Table,
  Input,
  Button,
  BackTop,
  Modal,
  Form,
  message,
  Select,
} from "antd";

const { Option } = Select;

const Data = () => {
  const myRef = useRef(null);
  const myRef1 = useRef(null);

  const [data, setData] = useState([]);
  const [macAddress, setMacAddress] = useState("");
  const [userMacAddress, setUserMacAddress] = useState([]);

  // let intervalId = null;

  const executeScroll = () => myRef.current.scrollIntoView();
  const executeScroll1 = () => myRef1.current.scrollIntoView();

  const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  };
  useEffect(() => {
    if (localStorage.getItem("user-info")) {
      history.push("/tables");
    }
    console.log("In USE");
    const agriData = () => {
      console.log("Calling");
      smartAgri
        .post("/api/mqtt/getOne", {
          macAddress: localStorage.getItem("macAddress"),
        })
        .then((res) => {
          console.log("Sucess");
          console.log(res.data.macAddress);
          setData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    agriData();
  }, [macAddress]);

  useEffect(() => {}, [data]);
  useInterval(() => {
    // Make the request here
    smartAgri
      .post("/api/mqtt/getOne", {
        macAddress: localStorage.getItem("macAddress"),
      })
      .then((res) => {
        console.log("Sucess");
        // localStorage.setItem("macAddress", JSON.stringify(macAddress));
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, 1000 * 60);

  const environmentData = data.map((d) => {
    return d.Environment[0];
  });
  const soilData = data.map((d) => {
    return d.Soil_Parameters[0];
  });

  const environmentCol = [
    {
      title: "Date/Time",
      dataIndex: "Time",
      key: "Time",
    },
    {
      title: "Temperature",
      dataIndex: "Temperautre",
      key: "Temprature",
    },
    {
      title: "Humidity",
      dataIndex: "Humidity",
      key: "humidity",
    },

    {
      title: "Atmosphereic Pressure",
      key: "atmosphericpressure",
      dataIndex: "Atmospheric_Pressure",
    },
  ];

  const soilCol = [
    // {
    //   title: "Date",
    //   dataIndex: "Date",
    //   key: "Date",
    //   defaultSortOrder: "descend",
    // },
    {
      title: "Date/Time",
      dataIndex: "Time",
      key: "Time",
    },
    {
      title: "Soil Moisture",
      dataIndex: "Soil_Moisture",
      key: "Soil_Moisture",
    },
    {
      title: "EC",
      dataIndex: "EC",
      key: "EC",
    },
    {
      title: "pH",
      dataIndex: "pH",
      key: "pH",
    },
    {
      title: "Nitrogen",
      dataIndex: "Nitrogen",
      key: "Nitrogen",
    },
    {
      title: "Phosphorus",
      dataIndex: "Phosphorus",
      key: "Phosphorus",
    },
    {
      title: "Potassium",
      dataIndex: "Potassium",
      key: "Potassium",
    },
  ];

  //Modal Functions
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getIdofLoggedInUser = () => {
    function parseJwt(token) {
      if (!token) {
        return;
      }
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace("-", "+").replace("_", "/");
      return JSON.parse(window.atob(base64));
    }

    const token = localStorage.getItem("user-info");
    const user = parseJwt(token);

    return user.id;
  };
  //Form Functions
  const onFinish = async (values) => {
    const id = getIdofLoggedInUser();
    console.log(id);
    await smartAgri
      .put(`/api/users/update/${id}`, {
        macAddress: values.macAddress,
      })
      .then((res) => {
        setIsModalVisible(false);
        message.success("Device Added");
      })
      .catch((err) => {
        console.log("ER");
        console.log(err);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  //Select Functions
  function handleChange(value) {
    localStorage.setItem("macAddress", value);

    setMacAddress(localStorage.getItem("macAddress", value));
    console.log(`selected ${localStorage.getItem("macAddress", value)}`);
  }

  const getMacAddresses = async () => {
    const id = getIdofLoggedInUser();

    await smartAgri
      .get(`/api/users/getMacAddress/${id}`)
      .then((res) => {
        setUserMacAddress(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const renderedOptions = userMacAddress.map((macadd) => {
    if (macadd) {
      return (
        <Option key={`${macadd}`} value={`${macadd}`}>
          {macadd}
        </Option>
      );
    } else {
      return;
    }
  });

  return (
    <>
      <div className="flex-container" style={{ marginBottom: "10px" }}>
        <Button
          type="primary"
          style={{
            paddingLeft: 11,
            borderRadius: "50px",
          }}
          onClick={executeScroll}
        >
          Soil Parameters
        </Button>
        <Button
          type="primary"
          style={{
            marginLeft: "10px",
            borderRadius: "50px",
          }}
          onClick={executeScroll1}
        >
          Charts
        </Button>
        <Button
          type="primary"
          className="addDevicebtn"
          onClick={showModal}
          style={{
            marginLeft: "10px",
            borderRadius: "50px",
          }}
        >
          Add New Device
        </Button>
        <Modal
          title="Add a New Device"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
            className="row-col"
          >
            <Form.Item
              className="username"
              label="Mac Address"
              name="macAddress"
              rules={[
                {
                  required: true,
                  message: "Please Enter Device MacAddress",
                },
              ]}
            >
              <Input
                placeholder="Enter MacAddress"
                style={{ paddingTop: 23.5, paddingBottom: 23.5 }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Add
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>

      <Select
        className="mac-search"
        defaultValue={localStorage.getItem("macAddress")}
        style={{ width: 120, borderRadius: "150px", marginBottom: "15px" }}
        onChange={handleChange}
        onClick={getMacAddresses}
      >
        {renderedOptions}
      </Select>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Environment"
            >
              <div className="table-responsive">
                <Table
                  key="enCol"
                  columns={environmentCol}
                  pagination={5}
                  dataSource={environmentData}
                  className="ant-border-space"
                />
              </div>
            </Card>
            <div ref={myRef}>
              <Card
                bordered={false}
                className="criclebox tablespace mb-24"
                title="Soil Parameters"
                style={{ marginTop: 50 }}
              >
                <div className="table-responsive">
                  <Table
                    key="soilCol"
                    columns={soilCol}
                    dataSource={soilData}
                    pagination={true}
                    className="ant-border-space"
                  />
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
      <div ref={myRef1} className="layout-content" style={{ marginTop: 50 }}>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={14} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <LineChart
                key="lineChart"
                enData={environmentData}
                soilData={soilData}
                data={data}
              />
            </Card>
          </Col>
        </Row>
      </div>
      <BackTop />
    </>
  );
};

export default Data;
