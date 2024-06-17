import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// imp middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// importing routes
import productRouter from "./routes/product.routes.js";
import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js";

// routes declaration

// products 
app.use("/api/v1/products", productRouter);
//  user route
app.use("/api/v1/user", userRouter);
// admin route
app.use("/api/v1/admin", adminRouter);

export { app };
