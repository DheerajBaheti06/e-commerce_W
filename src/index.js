import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});


connectDB()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`server is runnning at port : ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("MONGo DB connection failed !!!", err);
})
