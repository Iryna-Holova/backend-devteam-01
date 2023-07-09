const mongoose = require("mongoose");

const app = require("./app");

const { DB_HOST_TEST, PORT } = process.env;

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST_TEST)
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT);
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
