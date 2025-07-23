 
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import mongoose from "mongoose";
import { v2 as cloudinary } from 'cloudinary';

import courseRoute from "./routes/course.routes.js";
import userRoute from"./routes/user.routes.js";
import adminRoute from "./routes/admin.routes.js";
import orderRoute from "./routes/admin.routes.js";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";

const app=express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/' 
}));
app.use(cors({
origin:"http://localhost:5173",
credentials:true,
methods:["GET","POST","PUT","DELETE"],
allowedHeaders:["Content-Type","Authorization"],




})
)

const port = process.env.PORT||3001;
const DB_URI=process.env.MONGO_URI;
try {
 await mongoose.connect(DB_URI);
  console.log("Connected to mongo db");
} catch (error) {
  console.log(error);
}
app.use("/api/v1/course",courseRoute)
app.use("/api/v1/user",userRoute)
app.use("/api/v1/admin",adminRoute)
app.use("/api/v1/order",orderRoute)
cloudinary.config({ 
  cloud_name: process.env.cloud_name, 
  api_key: process.env.api_key, 
  api_secret: process.env.api_secret
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})