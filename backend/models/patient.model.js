import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

function generatePNR() {
  const MIN = 123_456; // Minimum 6-digit number
  const MAX = 999_999; // Maximum 6-digit number
  return Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
}

const patientSchema = new mongoose.Schema(
  {
    prn: {
      type: Number,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: function (value) {
          // Regex for validating alphanumeric names, 3-30 characters
          return /^[a-zA-Z0-9]{3,30}$/.test(value);
        },
        message: "Name must be 3-30 characters long and alphanumeric.",
      },
    },
    email: {
      type: String,
      required: true,
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

// Pre-save hook to ensure the PNR is unique
patientSchema.pre("save", async function (next) {
  if (this.isNew) {
    // only for new docs
    let pnr = generatePNR();

    while (await mongoose.models.Patient.findOne({ pnr })) {
      pnr = generatePNR();
    }

    this.pnr = pnr;
  }
  next();
});

// Method to validate password
patientSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate access token
patientSchema.methods.generateAccessTokens = function () {
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
patientSchema.methods.generateRefreshTokens = function () {
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

const PatientModel = mongoose.model("Patient", patientSchema);
export default PatientModel;
