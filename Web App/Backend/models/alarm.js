const mongoose = require("mongoose");

// let date = new Date();

let alarmSchema = mongoose.Schema({
  macAddress: {
    type: String,
    required: true,
  },
  temperature: {
    max: Number,
    min: Number,
  },
  humidity: {
    max: Number,
    min: Number,
  },
  atmosphereicPressure: {
    max: Number,
    min: Number,
  },
  soilMoisture: {
    max: Number,
    min: Number,
  },
  ec: {
    max: Number,
    min: Number,
  },
  ph: {
    max: Number,
    min: Number,
  },
  nitrogen: {
    max: Number,
    min: Number,
  },
  phosphorus: {
    max: Number,
    min: Number,
  },
  potassium: {
    max: Number,
    min: Number,
  },
});
let alarmModel = new mongoose.model("Alarm", alarmSchema);

module.exports = alarmModel;
