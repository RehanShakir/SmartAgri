import "../assets/styles/main.css";
import React, { useEffect, useState, useHistory } from "react";
import history from "../utils/CreateBrowserHistory";

import smartAgri from "../api/smartAgri";
import { Row, Col, Card, Table, Typography, Input } from "antd";

import { SearchOutlined } from "@ant-design/icons";

const { Title } = Typography;

const Tables = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(5);
  const [macAddress, setMacAddress] = useState("");

  useEffect(() => {
    if (localStorage.getItem("user-info")) {
      history.push("/tables");
    }
    console.log("In USE");
    const agriData = () => {
      smartAgri
        .post("/api/mqtt/getOne", {
          macAddress: macAddress,
        })
        .then((res) => {
          console.log("Sucess");
          setData(res.data);
          // console.log(res.data);
          // console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    agriData();
    // console.log(data);
  }, []);

  // const mappedData = data.map((d) => {
  //   return d.Environment[0];
  // });
  // const again = mappedData.map((d1) => {
  //   return d1.Atmospheric_Pressure;
  // });
  // console.log(data[0].Soil_Parameters[0]);

  const columns = [
    {
      title: "Temperature",
      dataIndex: "temperature",
      key: "name",
      render: () => `${data[0].Environment[0].Temperautre}`,
      // width: "32%",
    },
    {
      title: "Humidity",
      dataIndex: "humidity",
      render: () => `${data[0].Environment[0].Humidity}`,
      key: "function",
    },

    {
      title: "Atmosphereic Pressure",
      key: "status",
      dataIndex: "atmosphereicPressure",
      render: () => `${data[0].Environment[0].Atmospheric_Pressure}`,
    },
  ];

  const project = [
    {
      title: "Soil Moisture",
      dataIndex: "soil_moisture",
      render: () => `${data[0].Soil_Parameters[0].Soil_Moisture}`,
    },
    {
      title: "EC",
      dataIndex: "ec",
      render: () => `${data[0].Soil_Parameters[0].EC}`,
    },
    {
      title: "pH",
      dataIndex: "ph",
      render: () => `${data[0].Soil_Parameters[0].pH}`,
    },
    {
      title: "Nitrogen",
      dataIndex: "nitrogen",
      render: () => `${data[0].Soil_Parameters[0].Nitrogen}`,
    },
    {
      title: "Phosphorus",
      dataIndex: "phosphorus",
      render: () => `${data[0].Soil_Parameters[0].Phosphorus}`,
    },
    {
      title: "Potassium",
      dataIndex: "potassium",
      render: () => `${data[0].Soil_Parameters[0].Potassium}`,
    },
  ];

  return (
    <>
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
                  columns={columns}
                  dataSource={data}
                  pagination={5}
                  className="ant-border-space"
                />
              </div>
            </Card>

            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Soil Parameters"
              style={{ marginTop: 50 }}
            >
              <div className="table-responsive">
                <Table
                  columns={project}
                  dataSource={data}
                  pagination={true}
                  className="ant-border-space"
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Tables;
