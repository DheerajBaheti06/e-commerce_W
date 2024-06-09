import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

// path to .env
dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    // default port is 8001
    app.listen(process.env.PORT || 8001, () => {
      console.log(`server is runnning at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!!", err);
  });
