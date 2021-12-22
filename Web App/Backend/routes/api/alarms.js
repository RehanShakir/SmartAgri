const express = require("express");
const router = express.Router();
const _ = require("lodash");
const alarmModel = require("../../models/alarm");

router.get("/:macAddress", async (req, res) => {
  let macAddress = req.params.macAddress;
  let alarm = await alarmModel.findOne({ macAddress });
  return res.send(alarm);
});

router.post("/set/:macAddress", async (req, res) => {
  try {
    let { max, min } = req.body;
    console.log(max);
    console.log(min);
    console.log(req.params.col);

    let alarmSet = new alarmModel();
    alarmSet.macAddress = req.params.macAddress;
    alarmSet.temperature.max = max;
    alarmSet.temperature.min = min;
    alarmSet.humidity.max = max;
    alarmSet.humidity.min = min;
    alarmSet.atmosphereicPressure.max = max;
    alarmSet.atmosphereicPressure.min = min;
    alarmSet.soilMoisture.max = max;
    alarmSet.soilMoisture.min = min;
    alarmSet.ec.max = max;
    alarmSet.ec.min = min;
    alarmSet.ph.max = max;
    alarmSet.ph.min = min;
    alarmSet.nitrogen.max = max;
    alarmSet.nitrogen.min = min;
    alarmSet.phosphorus.max = max;
    alarmSet.phosphorus.min = min;
    alarmSet.potassium.max = max;
    alarmSet.potassium.min = min;

    await alarmSet.save();
    return res.send("added");
  } catch (err) {
    console.error(err);
  }
});
router.put("/set/:col/:macAddress", async (req, res) => {
  try {
    let { max, min } = req.body;

    let macAddress = req.params.macAddress;

    // let col = req.params.col;
    console.log(max);
    console.log(min);
    console.log(req.params.col);
    let alarm = await alarmModel.findOneAndUpdate({ macAddress });

    if (req.params.col === "temperature") {
      alarm.temperature.max = max;
      alarm.temperature.min = min;
      await alarm.save();
      return res.send("Updated");
    } else if (req.params.col === "humidity") {
      alarm.humidity.max = max;
      alarm.humidity.min = min;
      await alarm.save();
      return res.send("Updated");
    } else if (req.params.col === "atmosphereicPressure") {
      alarm.atmosphereicPressure.max = max;
      alarm.atmosphereicPressure.min = min;
      await alarm.save();
      return res.send("Updated");
    } else if (req.params.col === "soilMoisture") {
      alarm.soilMoisture.max = max;
      alarm.soilMoisture.min = min;
      await alarm.save();
      return res.send("Updated");
    } else if (req.params.col === "ec") {
      alarm.ec.max = max;
      alarm.ec.min = min;
      await alarm.save();
      return res.send("Updated");
    } else if (req.params.col === "ph") {
      alarm.ph.max = max;
      alarm.ph.min = min;
      await alarm.save();
      return res.send("Updated");
    } else if (req.params.col === "nitrogen") {
      alarm.nitrogen.max = max;
      alarm.nitrogen.min = min;
      await alarm.save();
      return res.send("Updated");
    } else if (req.params.col === "phosphorus") {
      alarm.phosphorus.max = max;
      alarm.phosphorus.min = min;
      await alarm.save();
      return res.send("Updated");
    } else if (req.params.col === "potassium") {
      alarm.potassium.max = max;
      alarm.potassium.min = min;
      await alarm.save();
      return res.send("Updated");
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
