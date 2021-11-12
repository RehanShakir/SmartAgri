import "../assets/styles/main.css";
import React, { useEffect, useState, useRef } from "react";
import history from "../utils/CreateBrowserHistory";
import LineChart from "../components/chart/LineChart";

import smartAgri from "../api/smartAgri";
import { Row, Col, Card, Table, Input, Button, BackTop } from "antd";

import { SearchOutlined } from "@ant-design/icons";

const Data = () => {
  const myRef = useRef(null);
  const myRef1 = useRef(null);

  const [data, setData] = useState([]);
  const [macAddress, setMacAddress] = useState("");

  const executeScroll = () => myRef.current.scrollIntoView();
  const executeScroll1 = () => myRef1.current.scrollIntoView();

  useEffect(() => {
    if (localStorage.getItem("user-info")) {
      history.push("/tables");
    }
    console.log("In USE");
    const agriData = () => {
      console.log("Calling");
      smartAgri
        .post("/api/mqtt/getOne", {
          macAddress,
        })
        .then((res) => {
          console.log("Sucess");
          localStorage.setItem("macAddress", JSON.stringify(macAddress));
          console.log(res.data.macAddress);
          setData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    agriData();
  }, [macAddress]);
  // console.log(data);
  const environmentData = data.map((d) => {
    return d.Environment[0];
  });

  const soilData = data.map((d) => {
    return d.Soil_Parameters[0];
  });

  const environmentCol = [
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
      </div>
      <Input
        className="mac-search"
        placeholder="Enter MacAddress"
        onChange={(e) => {
          setMacAddress(e.target.value);
        }}
        prefix={<SearchOutlined />}
      />
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
