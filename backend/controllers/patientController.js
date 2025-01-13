import enquirySchema from "../models/enquriySchema.js";
import eventSchema from "../models/event.js";
import blogSchema from "../models/blog.js";

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

const getEvent = async (req, res) => {
  try {
    const eventResponse = await eventSchema.find({});
    if (eventResponse) {
      return res.status(201).json({
        success: true,
        message: "Event fetched successfully!",
        data: eventResponse,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch event. Please try again.",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const getBlog = async (req, res) => {
  try {
    const blogResponse = await blogSchema.find({});
    if (blogResponse) {
      return res.status(201).json({
        success: true,
        message: "Blog fetched successfully!",
        data: blogResponse,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch blog. Please try again.",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export { saveEnquiry, getEvent, getBlog };
