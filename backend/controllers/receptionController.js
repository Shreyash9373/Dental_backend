import appointmentSchema from "../models/appointmentSchema.js";

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

export { bookAppointment, getPatient };
