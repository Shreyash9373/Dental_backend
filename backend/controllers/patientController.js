import enquirySchema from "../models/enquriySchema.js";
const saveEnquiry = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if ((!name, email, !phone)) {
      return res.status(400).json({ message: "Please fill all the fields" });
    } else {
      const enquiryData = {
        name,
        email,
        phone,
        message,
      };
      const newEnquiry = new enquirySchema(enquiryData);
      const enquirySaved = await newEnquiry.save();
      if (enquirySaved) {
        return res.status(201).json({
          success: true,
          message: "Thankyou for contacting, we will get back to you soon",
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Network Error caused, Please fill the form again",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export default saveEnquiry;
