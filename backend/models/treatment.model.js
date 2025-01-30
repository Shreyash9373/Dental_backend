import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Payment schema for individual payments
const paymentSchema = new mongoose.Schema({
  paid: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// Review schema
const reviewSchema = new mongoose.Schema({
  stars: {
    type: Number,
    required: false,
    enum: [0, 1, 2, 3, 4, 5],
    validate: {
      validator: function (value) {
        // This ensures that the value is an integer between 0 and 5
        return Number.isInteger(value) && value >= 0 && value <= 5;
      },
      message: "Star rating must be an integer between 0 and 5.",
    },
  },
  description: {
    type: String,
    required: false,
  },
});

const treatmentSchema = new mongoose.Schema(
  {
    doctor: {
      type: String,
      required: [true, "Cannot have treatment without doctor"],
      trim: true,
      lowercase: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    condition: {
      type: String,
      required: false,
    },
    prescription: {
      type: String,
      required: false,
    },
    payments: {
      type: Array[paymentSchema],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["UNPAID", "PENDING", "PAID"],
      default: "UNPAID",
    },
    payedAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    isDoctorVisiting: {
      type: Boolean,
      required: true,
      default: false,
    },
    review: {
      type: reviewSchema,
      required: false,
    },
  },
  { timestamps: true }
);

const TreatmentModel = mongoose.model("Treatment", treatmentSchema);
export default TreatmentModel;
