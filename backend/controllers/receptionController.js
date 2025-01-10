import appointmentSchema from "../models/appointmentSchema.js";
import enquirySchema from "../models/enquriySchema.js";

const bookAppointment = async (req, res) => {
  try {
    const {
      fullName,
      mobileNo,
      emailId,
      location,
      date,
      service,
      timeSlot,
      prescriptionFile,
    } = req.body;
    console.log(req.body.date);
    const existingAppointment = await appointmentSchema.findOne({
      date: date,
      timeSlot: timeSlot,
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "The selected timeslot is already booked for this date.",
      });
    }
    if (
      (!fullName, mobileNo, !emailId, !location, !date, !service, !timeSlot)
    ) {
      return res.status(400).json({ message: "Please fill all the fields" });
    } else {
      const patientData = {
        fullName,
        mobileNo,
        emailId,
        location,
        date,
        service,
        timeSlot,
        prescriptionFile,
      };
      const newPatient = new appointmentSchema(patientData);
      const patientSaved = await newPatient.save();
      if (patientSaved) {
        return res
          .status(201)
          .json({ success: true, message: "Appointment booked successfully" });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Failed to book appointment" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const getPatient = async (req, res) => {
  try {
    // YYYY/MM/DD- date format
    const { date } = req.body;
    console.log(req.body);
    const patient = await appointmentSchema.find({ date });

    if (patient.length > 0) {
      return res.status(200).json({ success: true, patient });
    } else if (patient.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No patient found" });
    } else {
      return res.status(400).json({ success: false, message: "Network error" });
    }
  } catch (error) {
    console.log(error);
  }
};

const getEnquiry = async (req, res) => {
  const enquiryData = await enquirySchema.find({});
  if (enquiryData.length > 0) {
    return res.status(200).json({ success: true, enquiryData });
  } else if (enquiryData.length === 0) {
    return res.status(200).json({ success: true, message: "No Enquiry" });
  } else {
    return res.status(400).json({ success: false, message: "Network error" });
  }
};

const updatePatient = async (req, res) => {
  try {
    const { _id, fullName, mobileNo, service, timeSlot, date, status } =
      req.body;

    if (
      !_id ||
      !fullName ||
      !mobileNo ||
      !service ||
      !timeSlot ||
      !date ||
      !status
    ) {
      return res.json({ success: false, message: "Data Missing" });
    }

    const response = await appointmentSchema.findByIdAndUpdate(_id, {
      _id,
      fullName,
      mobileNo,
      service,
      timeSlot,
      date,
      status,
    });
    if (response) {
      return res
        .status(200)
        .json({ success: true, message: "Profile Updated" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Failed to Update" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { bookAppointment, getPatient, getEnquiry, updatePatient };
