import React, { useEffect, useState, useRef } from "react";
import history from "../utils/CreateBrowserHistory";
import LineChart from "../components/chart/LineChart";
import "../assets/styles/main.css";

import smartAgri from "../api/smartAgri";
import { store, useGlobalState } from "state-pool";

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
  Descriptions,
} from "antd";
import { BrowserRouter } from "react-router-dom";

const { Option } = Select;

const btnPublish = {
  paddingLeft: 11,
  borderRadius: "50px",
  marginLeft: "10px",
};

const Data = () => {
  const myRef = useRef(null);
  const myRef1 = useRef(null);
  const myRef2 = useRef(null);

  const [data, setData] = useState([]);
  const [macAddress, setMacAddress] = useState("");
  const [alarm, setAlarm] = useState("");
  const [userMacAddress, setUserMacAddress] = useState([]);
  const [relay1, setRelay1] = useState("");
  const [relay2, setRelay2] = useState("");
  const [relay3, setRelay3] = useState("");

  // console.log(relay1N);

  // const relay1N = () =>
  // {

  // }

  const handleRe1Data = () => {
    console.log("CLICK FROM DATA btn1");
    agriData();
  };
  const handleRe2Data = () => {
    console.log("CLICK FROM DATA btn2");
    agriData();
  };
  const handleRe3Data = () => {
    console.log("CLICK FROM DATA btn3");
    agriData();
  };
  const handleMsg = () => {
    console.log("CLICK FROM DATA Msg");
    agriData();
  };

  store.setState("handleRe1", handleRe1Data);
  store.setState("handleRe2", handleRe2Data);
  store.setState("handleRe3", handleRe3Data);
  store.setState("handleMsg", handleMsg);
  // const [handleR1, setHandleR1] = useGlobalState("handleRe1");

  const [msg, setMsg] = useState("");

  // let intervalId = null;

  const executeScroll = () => myRef.current.scrollIntoView();
  const executeScroll1 = () => myRef1.current.scrollIntoView();
  const executeScroll2 = () => myRef2.current.scrollIntoView();

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
  const agriData = () => {
    // console.log("Calling");
    smartAgri
      .post("/api/mqtt/getOne", {
        macAddress: localStorage.getItem("macAddress"),
      })
      .then((res) => {
        // console.log("Sucess");
        let lastIndex = res.data.length - 1;
        console.log(res.data[lastIndex].msg);
        console.log(res.data[lastIndex]);
        setRelay1(res.data[lastIndex].relay1);
        setRelay2(res.data[lastIndex].relay2);
        setRelay3(res.data[lastIndex].relay3);
        setMsg(res.data[lastIndex].msg);

        setData(res.data.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // if (relay1N === true && ab === true) {
  //   console.log("In data realy1n");
  //   agriData();
  //   console.log("ab=" + ab);
  //   ab = false;
  // } else {
  //   ab = true;
  // }

  // if (relay2N) {
  //   agriData();
  // }
  // const re1 = localStorage.getItem(
  //   `${localStorage.getItem("macAddress")}Relay1`
  // );
  // // const checkIfChange = () => {
  // if (
  //   localStorage.getItem(`${localStorage.getItem("macAddress")}Relay1`) === "on"
  // ) {
  //   setRelay1N("on");
  // } else {
  //   setRelay1N("off");
  // }
  // };

  useEffect(() => {
    if (localStorage.getItem("user-info")) {
      history.push("/tables");
    }
    // console.log("In USE");

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
        // console.log("Sucess");
        // localStorage.setItem("macAddress", JSON.stringify(macAddress));
        // console.log(res.data);
        let lastIndex = res.data.length - 1;

        setRelay1(res.data[lastIndex].relay1);
        setRelay2(res.data[lastIndex].relay2);
        setRelay3(res.data[lastIndex].relay3);
        setMsg(res.data[lastIndex].msg);
        setData(res.data.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  }, 1000 * 60);

  // console.log(data);

  const environmentData = data.map((d) => {
    return d.Environment[0];
  });
  const soilData = data.map((d) => {
    return d.Soil_Parameters[0];
  });

  const environmentCol = [
    {
      title: "Date/Time",
      // dataIndex: "Time",
      key: "Time",
      render: (record) => {
        return record.Time.substring(0, record.Time.indexOf("("));
      },
    },
    {
      title: "Temperature",
      // dataIndex: "Temperautre",
      key: "Temprature",
      align: "center",
      render: (record) => {
        return {
          props: {
            style: {
              background:
                (localStorage.getItem("temperatureMax") ||
                  localStorage.getItem("temperatureMin")) == 0
                  ? ""
                  : record.Temperautre > localStorage.getItem("temperatureMax")
                  ? "red"
                  : record.Temperautre < localStorage.getItem("temperatureMin")
                  ? "red"
                  : "",
            },
          },
          children: record.Temperautre,
        };
      },
    },
    {
      title: "Humidity",
      // dataIndex: "Humidity",
      key: "humidity",
      align: "center",
      render: (record) => {
        return {
          props: {
            style: {
              background:
                (localStorage.getItem("humidityMax") ||
                  localStorage.getItem("humidityMin")) == 0
                  ? ""
                  : record.Humidity > localStorage.getItem("humidityMax")
                  ? "red"
                  : record.Humidity < localStorage.getItem("humidityMin")
                  ? "red"
                  : "",
            },
          },
          children: record.Humidity,
        };
      },
    },

    {
      title: "Atmosphereic Pressure",
      align: "center",
      key: "atmosphericpressure",
      // dataIndex: "Atmospheric_Pressure",
      render: (record) => {
        return {
          props: {
            style: {
              background:
                (localStorage.getItem("atmosphereicPressureMax") ||
                  localStorage.getItem("atmosphereicPressureMin")) == 0
                  ? ""
                  : record.Atmospheric_Pressure >
                    localStorage.getItem("atmosphereicPressureMax")
                  ? "red"
                  : record.Atmospheric_Pressure <
                    localStorage.getItem("atmosphereicPressureMin")
                  ? "red"
                  : "",
            },
          },
          children: record.Atmospheric_Pressure,
        };
      },
    },
  ];

  const soilCol = [
    {
      title: "Date/Time",
      // dataIndex: "Time",
      key: "Time",

      render: (record) => {
        return record.Time.substring(0, record.Time.indexOf("("));
      },
    },
    {
      title: "Soil Moisture",
      align: "center",
      // dataIndex: "Soil_Moisture",
      key: "Soil_Moisture",
      render: (record) => {
        return {
          props: {
            style: {
              background:
                (localStorage.getItem("soilMoistureMax") ||
                  localStorage.getItem("soilMoistureMin")) == 0
                  ? ""
                  : record.Soil_Moisture >
                    localStorage.getItem("soilMoistureMax")
                  ? "red"
                  : record.Soil_Moisture <
                    localStorage.getItem("soilMoistureMin")
                  ? "red"
                  : "",
            },
          },
          children: record.Soil_Moisture,
        };
      },
    },
    {
      title: "EC",
      // dataIndex: "EC",
      key: "EC",
      align: "center",
      render: (record) => {
        return {
          props: {
            style: {
              background:
                (localStorage.getItem("ecMax") ||
                  localStorage.getItem("ecMin")) == 0
                  ? ""
                  : record.EC > localStorage.getItem("ecMax")
                  ? "red"
                  : record.EC < localStorage.getItem("ecMin")
                  ? "red"
                  : "",
            },
          },
          children: record.EC,
        };
      },
    },
    {
      title: "pH",
      // dataIndex: "pH",
      key: "pH",
      align: "center",
      render: (record) => {
        return {
          props: {
            style: {
              background:
                (localStorage.getItem("phMax") ||
                  localStorage.getItem("phMin")) == 0
                  ? ""
                  : record.pH > localStorage.getItem("phMax")
                  ? "red"
                  : record.pH < localStorage.getItem("phMin")
                  ? "red"
                  : "",
            },
          },
          children: record.pH,
        };
      },
    },
    {
      title: "Nitrogen",
      // dataIndex: "Nitrogen",
      key: "Nitrogen",
      align: "center",
      render: (record) => {
        return {
          props: {
            style: {
              background:
                (localStorage.getItem("nitrogenMax") ||
                  localStorage.getItem("nitrogenMin")) == 0
                  ? ""
                  : record.Nitrogen > localStorage.getItem("nitrogenMax")
                  ? "red"
                  : record.Nitrogen < localStorage.getItem("nitrogenMin")
                  ? "red"
                  : "",
            },
          },
          children: record.Nitrogen,
        };
      },
    },
    {
      title: "Phosphorus",
      // dataIndex: "Phosphorus",
      key: "Phosphorus",
      align: "center",
      render: (record) => {
        return {
          props: {
            style: {
              background:
                (localStorage.getItem("phosphorusMax") ||
                  localStorage.getItem("phosphorusMin")) == 0
                  ? ""
                  : record.Phosphorus > localStorage.getItem("phosphorusMax")
                  ? "red"
                  : record.Phosphorus < localStorage.getItem("phosphorusMin")
                  ? "red"
                  : "",
            },
          },
          children: record.Phosphorus,
        };
      },
    },
    {
      title: "Potassium",
      // dataIndex: "Potassium",
      key: "Potassium",
      align: "center",
      render: (record) => {
        return {
          props: {
            style: {
              background:
                (localStorage.getItem("potassiumMax") ||
                  localStorage.getItem("potassiumMin")) == 0
                  ? ""
                  : record.Potassium > localStorage.getItem("potassiumMax")
                  ? "red"
                  : record.Potassium < localStorage.getItem("potassiumMin")
                  ? "red"
                  : "",
            },
          },
          children: record.Potassium,
        };
      },
    },
  ];

  //Modal Functions
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleAlarm, setIsModalVisibleAlarm] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };
  const showModalAlarm = () => {
    setIsModalVisibleAlarm(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };
  const handleOkAlarm = () => {
    setIsModalVisibleAlarm(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleCancelAlarm = () => {
    setIsModalVisibleAlarm(false);
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
    // console.log(id);
    await smartAgri
      .put(`/api/users/update/${id}`, {
        macAddress: values.macAddress,
      })
      .then((res) => {
        setIsModalVisible(false);
        message.success("Device Added");
      })
      .catch((err) => {
        // console.log("ER");
        console.log(err);
      });

    await smartAgri
      .post(`/api/alarm/set/${values.macAddress}`, {
        max: 0,
        min: 0,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onFinishAlarm = async (values) => {
    localStorage.setItem(`${alarm}Max`, values.max);
    localStorage.setItem(`${alarm}Min`, values.min);
    console.log(values.min);

    await smartAgri
      .put(`/api/alarm/set/${alarm}/${localStorage.getItem("macAddress")}`, {
        max: values.max,
        min: values.min,
      })
      .then((res) => {
        setIsModalVisibleAlarm(false);

        console.log(res);
        agriData();
        message.success("Updated");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onFinishFailedAlarm = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  //Select Functions
  function handleChange(value) {
    localStorage.setItem("macAddress", value);

    setMacAddress(localStorage.getItem("macAddress", value));

    smartAgri
      .get(`/api/alarm/${value}`)
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("temperatureMax", res.data.temperature.max);
        localStorage.setItem("temperatureMin", res.data.temperature.min);
        localStorage.setItem("humidityMax", res.data.humidity.max);
        localStorage.setItem("humidityMin", res.data.humidity.min);
        localStorage.setItem(
          "atmosphereicPressureMax",
          res.data.atmosphereicPressure.max
        );
        localStorage.setItem(
          "atmosphereicPressureMin",
          res.data.atmosphereicPressure.min
        );
        localStorage.setItem("soilMoistureMax", res.data.soilMoisture.max);
        localStorage.setItem("soilMoistureMin", res.data.soilMoisture.min);
        localStorage.setItem("ecMax", res.data.ec.max);
        localStorage.setItem("ecMin", res.data.ec.min);
        localStorage.setItem("phMax", res.data.ph.max);
        localStorage.setItem("phMin", res.data.ph.min);
        localStorage.setItem("nitrogenMax", res.data.nitrogen.max);
        localStorage.setItem("nitrogenMin", res.data.nitrogen.min);
        localStorage.setItem("phosphorusMax", res.data.phosphorus.max);
        localStorage.setItem("phosphorusMin", res.data.phosphorus.min);
        localStorage.setItem("potassiumMax", res.data.potassium.max);
        localStorage.setItem("potassiumMin", res.data.potassium.min);
      })
      .catch((err) => {
        console.log(err);
      });

    // console.log(`selected ${localStorage.getItem("macAddress", value)}`);
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
  window.addEventListener("storage", () => console.log("HELLL"));
  var localStorageSetHandler = function (e) {
    console.log(
      'localStorage.set("' + e.key + '", "' + e.value + '") was called'
    );
  };
  // localStorageSetHandler();

  document.removeEventListener("itemInserted", localStorageSetHandler, false);
  // document.removeEventListener("itemRemoved", localStorageSetHandler, false);

  // console.log(new StorageEvent());
  const handleChangeAlarm = (value) => {
    console.log(value);
    setAlarm(value);
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
          onClick={executeScroll2}
        >
          Actuators
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
          destroyOnClose
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
        <Button
          type="primary"
          className="addDevicebtn"
          onClick={showModalAlarm}
          style={{
            marginLeft: "10px",
            borderRadius: "50px",
          }}
        >
          Set Alarm
        </Button>
        <Modal
          title="Add Alarm"
          visible={isModalVisibleAlarm}
          onOk={handleOkAlarm}
          onCancel={handleCancelAlarm}
          destroyOnClose
        >
          <Form
            onFinish={onFinishAlarm}
            onFinishFailed={onFinishFailedAlarm}
            layout="vertical"
            className="row-col"
          >
            <Select
              defaultValue="select"
              className="mac-search"
              style={{
                width: "100%",
                borderRadius: "150px",
                marginBottom: "15px",
              }}
              onChange={handleChangeAlarm}
            >
              <Option value="select">Select</Option>
              <Option value="temperature">Temperature</Option>
              <Option value="humidity">Humidity</Option>
              <Option value="atmosphereicPressure">
                Atmosphereic Pressure
              </Option>
              <Option value="soilMoisture">Soil Moisture </Option>
              <Option value="ec">EC</Option>
              <Option value="ph">pH</Option>
              <Option value="nitrogen">Nitrogen</Option>
              <Option value="phosphorus">Phosphorus</Option>
              <Option value="potassium">Potassium</Option>
            </Select>
            <Form.Item
              className="username"
              label="Max"
              name="max"
              rules={[
                {
                  required: true,
                  message: "Please Enter a Value",
                },
              ]}
            >
              <Input
                placeholder="Enter Max"
                value="ababab"
                style={{ paddingTop: 23.5, paddingBottom: 23.5 }}
              />
            </Form.Item>
            <Form.Item
              className="username"
              label="Min"
              name="min"
              rules={[
                {
                  required: true,
                  message: "Please Enter a value",
                },
              ]}
            >
              <Input
                placeholder="Enter Min"
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
            <div ref={myRef2}>
              <Card
                bordered={false}
                className="criclebox tablespace mb-24"
                title="Actuators"
                style={{ marginTop: 50 }}
              >
                <div className="table-responsive">
                  <Descriptions bordered>
                    <Descriptions.Item span={3} label="Relay 1">
                      {relay1}
                    </Descriptions.Item>
                    <Descriptions.Item span={3} label="Relay 2">
                      {relay2}
                    </Descriptions.Item>
                    <Descriptions.Item span={3} label="Relay 3">
                      {relay3}
                    </Descriptions.Item>
                    <Descriptions.Item label="Message">{msg}</Descriptions.Item>
                  </Descriptions>
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
