// const express = require('express');
import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import { connect } from "http2";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/couponRoutes", couponRoutes);
app.use("api/payments", paymentRoutes);
app.use("api/analytics", analyticsRoutes);


app.listen(PORT, () => {
  console.log("App is running on http://localhost:" + PORT);
  connectDB();
});
