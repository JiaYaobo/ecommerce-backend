const express = require("express");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const authRoute = require("./routes/auth");
const orderRoute = require("./routes/order");
const productRoute = require("./routes/product");
const storeRoute = require("./routes/store");
const memberRoute = require("./routes/member");
const commentRoute = require("./routes/comment");

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());

app.use("/api/auth", authRoute);
app.use("/api/order", orderRoute);
app.use("/api/product", productRoute);
app.use("/api/store", storeRoute);
app.use("/api/member", memberRoute);
app.use("/api/comment", commentRoute);

app.listen(8800, () => {
  console.log("Backend server is running");
});
