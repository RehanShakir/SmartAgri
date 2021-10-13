const mqtt = require("mqtt");
const express = require("express");
const router = express.Router();
const mqttMessgae = require("../../models/mqttmessage");

const host = "broker.hivemq.com";
const port = "1883";
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const connectUrl = `mqtt://${host}:${port}`;

router.get("/", async (req, res) => {
  try {
    let mqttMessgaes = await mqttMessgae.find();

    res.send(mqttMessgaes);
  } catch (err) {
    console.log(err);
  }
});
router.post("/", async (req, res) => {
  try {
    const client = mqtt.connect(connectUrl, {
      clientId,
      clean: true,
      connectTimeout: 4000000,
      username: "hello",
      password: "hello",
      reconnectPeriod: 1000000,
    });

    const topic = req.body.macAddress;
    client.on("connect", () => {
      console.log("Connected");
      client.subscribe([topic], () => {
        console.log(`Subscribe to topic '${topic}'`);
      });
    });

    client.on("message", (topic, payload) => {
      let message = JSON.parse(payload);
      console.log("Received Message:", topic, message);

      let MqttMessgae = new mqttMessgae({
        macAddress: req.body.macAddress,
        FW_Version: message.FW_Version,
        Environment: message.Environment[0],
        Soil_Parameters: message.SoilParameters[0],
      });
      MqttMessgae.save();
    });
    res.send("DATA SAVED");
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
