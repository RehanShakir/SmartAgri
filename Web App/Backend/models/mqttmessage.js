const mongoose = require("mongoose");

// let date = new Date();

let mqttMessageSchema = mongoose.Schema(
  {
    macAddress: {
      type: String,
      required: true,
    },
    relay1: {
      type: String,
    },
    relay2: {
      type: String,
    },
    relay3: {
      type: String,
    },
    msg: {
      type: String,
    },

    FW_Version: {
      type: String,
    },
    Environment: [
      {
        Temperautre: Number,
        Humidity: Number,
        Atmospheric_Pressure: Number,
        Time: { type: String, default: Date },

        // Date: { type: String, default: date.toLocaleDateString() },
      },
    ],
    Soil_Parameters: [
      {
        Soil_Moisture: Number,
        EC: Number,
        pH: Number,
        Nitrogen: Number,
        Phosphorus: Number,
        Potassium: Number,
        Time: { type: String, default: Date },
        // Date: { type: String, default: date.toLocaleDateString() },
      },
    ],
  },
  { timestamps: true }
);
let mqttMessageModel = new mongoose.model("Mqttmessage", mqttMessageSchema);

module.exports = mqttMessageModel;
