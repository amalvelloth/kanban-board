const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer")

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists", error: { details: [{ message: "User already exists" }] } });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ success: true, message: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(403).json({ success: false, message: "Auth failed email or password is wrong" });
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({ success: false, message: "Auth failed email or password is wrong" });
    }
    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "24h" }
    );
    res.status(200).json({ success: true, message: "Login successful", jwtToken, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const logout = async (req, res) => {
  return res.status(200).json({ success: true, message: "Logout successful" });
}

// forgot password controller
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // generate secure token
    const token = crypto.randomBytes(20).toString("hex");

    //set expiration to 1 hour from now
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    //create reset URL 
    const resetUrl = `http://localhost:5173/reset-password?token=${token}&email=${user.email}`;

    //If credentials are not setup, log URL to console for easy local development testing
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("\n--- PASSWORD RESET LINK ---");
      console.log(resetUrl);
      console.log("---------------------\n");
      return res.status(200).json({
        success: true,
        message: "Reset link generated! Check server console log."
      });
    }

    //setup transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    //configure mail options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Please click on the link below to reset your password: \n\n${resetUrl}\n\nThis link will expire in 1 hour.`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Reset link sent to your email." });


  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internak server error" });
  }
};

// Reset password controller
const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const user = await User.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({ success: true, message: "Password successfully reset." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { signup, login, logout, forgotPassword, resetPassword };

