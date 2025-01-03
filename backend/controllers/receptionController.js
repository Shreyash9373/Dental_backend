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

export default bookAppointment;
