import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 4000,
  jwt_secret: process.env.JWT_SECRET,
  expires_in: process.env.EXPIRES_IN,
  session_key: process.env.SESSION_KEY!,
  session_name: "chappy_auth",
  session_prefix: "chappy:",
};

export default config;
