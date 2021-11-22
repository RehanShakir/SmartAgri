const mongoose = require("mongoose");

// let date = new Date();

let mqttMessageSchema = mongoose.Schema(
  {
    macAddress: {
      type: String,
      required: true,
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
