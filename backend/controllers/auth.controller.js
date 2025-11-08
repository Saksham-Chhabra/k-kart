import { ref } from "process";
import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jswt from "jsonwebtoken";

const generateToken = (userId) => {
  const accessToken = jswt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jswt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  // Store refresh token in Redis with userId as key
  await redis.set(
    `user:${userId}:refresh_token`, // Key
    refreshToken, // Value
    "EX", // expiry option
    7 * 24 * 60 * 60
  ); // Set expiry to 7 days
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // Prevents XSS attacks
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "Strict", // Prevent CSRF attacks (cross-site request forgery)
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // Prevents XSS attacks
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "Strict", // Prevent CSRF attacks (cross-site request forgery)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export async function signup(req, res) {
  const { email, password, name } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({ name, email, password });
    //authenticate user
    const { accessToken, refreshToken } = generateToken(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);
    res.status(201).json({
      message: "User created successfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log("error in signup controller", error.message);
    return res
      .status(500)
      .json({ message: "Error checking user existence", error });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const { accessToken, refreshToken } = generateToken(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);
    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log("error in login controller", error.message);
    return res.status(500).json({ message: "Error logging in user", error });
  }
}
export function logout(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    if (refreshToken === undefined) {
      return res.status(400).json({ message: "No refresh token provided" });
    }
    const decoded = jswt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    redis.del(`user:${decoded.userId}:refresh_token`);
    console.log("user deleted from redis");
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("error in logout controller", error.message);
    return res.status(500).json({ message: "Error logging out user", error });
  }
}

export async function refreshToken(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }
    const decoded = jswt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log(decoded, "decoded");
    const storedToken = await redis.get(`user:${decoded.userId}:refresh_token`);
    if (storedToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    const accessToken = jswt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000,
    });
    res.status(200).json({ accessToken });
  } catch (error) {
    console.log("error in refresh token controller", error.message);
    return res.status(500).json({ message: "Error refreshing token", error });
  }
}

// TODO IMPLEEMENT GET PROFILE

export function getProfile() {}
