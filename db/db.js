const mongoose = require("mongoose");
const { DB_URI } = process.env;
mongoose
  .connect(DB_URI)
  .then(() => console.log("Database connection successful"))
  .catch((error) => {
    console.error("Database connection error", error);
    process.exit(1);
  });
