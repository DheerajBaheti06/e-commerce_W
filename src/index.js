import dotenv from "dotenv";
import connectDB from "./db/index.js";
const PORT = process.env

dotenv.config({
  path: "./env",
});


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`server is runnning at port : ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("MONGo DB connection failed !!!, err");
})
