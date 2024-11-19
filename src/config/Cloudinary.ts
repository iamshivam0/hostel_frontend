import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dp0vl6tms",
  api_key: "549889991612114",
  api_secret: "wI2kMDjc0DF1ySMmykqtgYSOgCg",
});
// console.log(process.env.CLOUDINARY_API_KEY);

export default cloudinary;
