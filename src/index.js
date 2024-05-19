import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8001, () => {
    //   console.log(`server is runnning at port : ${process.env.PORT}`);
      console.log(`server is runnning at port : 8001`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!!", err);
  });
