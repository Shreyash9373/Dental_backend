import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const receptionistSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          // Simple regex to check email format
          const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
          return emailRegex.test(value);
        },
        message: "Please provide a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minlength: [8, "Password must be at least 8 characters long"],
      validate: {
        validator: function (value) {
          // At least 1 uppercase, 1 lowercase, 1 number, and 1 special character
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            value
          );
        },
        message:
          "Password must have at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.",
      },
    },
    refreshToken: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash the password
receptionistSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to validate password
receptionistSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate access token
receptionistSchema.methods.generateAccessTokens = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET || "defaultAccessTokenSecret",
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1h", // Default to 1 hour if not set
    }
  );
};

// Method to generate refresh token
receptionistSchema.methods.generateRefreshTokens = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET || "defaultRefreshTokenSecret",
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d", // Default to 7 days if not set
    }
  );
};

const ReceptionistModel = mongoose.model("Receptionist", receptionistSchema);
export default ReceptionistModel;
