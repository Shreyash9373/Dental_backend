import mongoose from "mongoose";
const appointment = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/, // Ensures a valid 10-digit mobile number
    },
    emailId: {
      type: String,
      required: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Ensures a valid email format
    },
    location: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true, // You can use predefined slots like "10:00 AM - 10:30 AM"
    },
    prescriptionFile: {
      type: String, // This field can store the file URL or path
      required: false, // Optional field
    },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt fields automatically

const appointmentSchema = mongoose.model("Appointment", appointment);
export default appointmentSchema;
