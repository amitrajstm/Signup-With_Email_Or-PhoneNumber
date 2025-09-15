const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      unique: true,
      sparse: true, // allow multiple users without phone number
      match: [/^\d+$/, "Phone number must contain only digits"],
    },
    phoneSuffix: {
      type: String,
    },
    username: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 30,
      unique: true,
      sparse: true, // ✅ allows multiple null usernames
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // allow multiple users without email
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), // ✅ only validate if provided
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },

    // ✅ OTP fields
    emailOtp: {
      type: String,
    },
    emailOtpExpiry: {
      type: Date,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ✅ Custom validation: require at least one of email or phoneNumber
userSchema.pre("validate", function (next) {
  if (!this.email && !this.phoneNumber) {
    next(new Error("Either email or phoneNumber is required"));
  } else {
    next();
  }
});

module.exports = mongoose.model("User", userSchema);
