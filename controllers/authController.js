const otpGenerater = require("../utils/otpGenerater");
const User = require("../models/user.js");
const sendOtpToEmail = require("../services/emailService.js");
const twilioService = require("../services/twilioService.js");
const generateToken = require("../utils/generateToken.js");

// Step 1: Send OTP
const sendOtp = async (req, res) => {
  const { phoneNumber, phoneSuffix, email } = req.body;
  const otp = otpGenerater();
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  try {
    let user;

    // --- Email OTP ---
    if (email) {
      user = await User.findOne({ email });
      if (!user) user = new User({ email });

      user.emailOtp = otp;
      user.emailOtpExpiry = expiry;
      await user.save();

      await sendOtpToEmail(email, otp);

      return res
        .status(200)
        .json({ message: `OTP sent to your email: ${email}` });
    }

    // --- Phone OTP ---
    if (!phoneNumber || !phoneSuffix) {
      return res
        .status(400)
        .json({ message: "Phone Number and Phone Suffix are required" });
    }

    const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;
    user = await User.findOne({ phoneNumber });
    if (!user) user = new User({ phoneNumber, phoneSuffix });

    // send OTP via Twilio first
    await twilioService.sendOtpToPhoneNumber(fullPhoneNumber);

    // only save user if OTP was sent successfully
    await user.save();

    return res.status(200).json({ message: "OTP sent successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Step 2: Verify OTP
const verifyOtp = async (req, res) => {
  const { phoneNumber, phoneSuffix, email, otp } = req.body;

  try {
    let user;

    // --- Email OTP ---
    if (email) {
      user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }

      const now = new Date();
      if (
        !user.emailOtp ||
        String(user.emailOtp) !== String(otp) ||
        now > new Date(user.emailOtpExpiry)
      ) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      user.isVerified = true;
      user.emailOtp = null;
      user.emailOtpExpiry = null;
      await user.save();
    } else {
      // --- Phone OTP ---
      if (!phoneNumber || !phoneSuffix) {
        return res
          .status(400)
          .json({ message: "Phone Number and Phone Suffix are required" });
      }

      const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;
      user = await User.findOne({ phoneNumber });
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }

      const result = await twilioService.verifyOtp(fullPhoneNumber, otp);
      if (result.status !== "approved") {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      user.isVerified = true;
      await user.save();
    }

    // --- JWT token ---
    const token = generateToken(user?._id);
    res.cookie("auth_token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    });

    return res.status(200).json({
      message: "OTP verified successfully",
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
};
