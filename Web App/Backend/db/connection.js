const mongoose = require("mongoose");

mongoose
  .connect("mongodb://srv-captain--sensors-db/mydatabase?authSource=admin", {
    user: "sensorsdb",
    pass: "sensorsdb",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log("Error Connecting to Database");
    console.log(err);
  });
