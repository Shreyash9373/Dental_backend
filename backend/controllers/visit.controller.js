import DoctorModel from "../models/doctor.model.js";
import PatientModel from "../models/patient.model.js";
import VisitModel from "../models/visit.model.js";
import { ResponseError } from "../utils/error.js";

const addVisit = async (req, res) => {
  // TODO: get all fields (also do this for create operation for all resources)
  const { doctor, patientId, condition, prescription, totalAmount } = req.body;

  const visit = await VisitModel.create({
    doctor,
    patientId,
    condition,
    prescription,
    totalAmount,
  });

  return res.status(201).json({
    success: true,
    visit,
  });
};

const addPaymentForVisit = async (req, res) => {
  const { visitId } = req.params;
  let { amount } = req.body;

  amount = parseFloat(amount);

  if (isNaN(amount) || amount <= 0)
    throw new ResponseError(400, "Amount should be a greater than 0");

  const visit = await VisitModel.findById(visitId);
  visit.makePayment(amount);

  return res.status(200).json({
    success: true,
    visit,
  });
};

const addReview = async (req, res) => {
  const { visitId } = req.params;
  let { rating, description } = req.body;

  rating = parseInt(rating);
  if (isNaN(rating) || rating > 5 || rating < 0)
    throw new ResponseError(400, "Rating should be between 0-5");

  const visit = await VisitModel.findById(visitId);

  if (visit.review)
    throw new ResponseError(400, "This visit already has a review");
  else {
    visit.review = {
      rating,
      description,
    };
    await visit.save();
  }

  return res.status(200).json({
    success: true,
    visit,
  });
};

const searchVisitByPRN = async (req, res) => {
  const { prn } = req.params;

  if (!prn) throw new ResponseError(400, "PRN is required");

  const patientId = await PatientModel.findOne({ prn });
  if (!patientId) throw new ResponseError(400, "No patient found!");

  const visits = await VisitModel.find({ patientId });

  return res.status(200).json({
    success: true,
    visits,
  });
};

const searchUnpaidOrPendingStatusVisit = async (req, res) => {
  const visits = await VisitModel.find({
    $or: [{ paymentStatus: "UNPAID" }, { paymentStatus: "PENDING" }],
  });

  return res.status(200).json({
    success: true,
    visits,
  });
};

const searchVisitsByDoctorId = async (req, res) => {
  const { doctorId } = req.params;
  if (!doctorId) throw new ResponseError(400, "Doctor Id is required");

  const existingDoctor = await DoctorModel.findById(doctorId);
  if (!existingDoctor) throw new ResponseError(404, "Doctor does not exists");

  const visits = await VisitModel.find({ doctor: existingDoctor._id });

  return res.status(200).json({
    success: true,
    visits,
  });
};

const searchVisit = async (req, res) => {
  const { condition, prescription } = req.query;
  let filteredVisits = [];

  if (condition || prescription) {
    filteredVisits = await VisitModel.find({
      $or: [
        { condition: RegExp(`(?=.*${condition?.split("").join(".*")})`, "i") },
        {
          prescription: RegExp(
            `(?=.*${prescription?.split("").join(".*")})`,
            "i"
          ),
        },
      ],
    });
  }

  return res.status(200).json({
    success: true,
    visits: filteredVisits,
  });
};

const updateVisit = async (req, res) => {
  const { visitId } = req.params;
  const {
    doctor,
    patientId,
    condition,
    prescription,
    paymentStatus,
    totalAmount,
    isDoctorVisiting,
  } = req.body;

  const visit = await VisitModel.findById(visitId);
  if (!visit) throw new ResponseError(400, "Visit not found");

  visit.doctor = doctor || visit.doctor;
  visit.patientId = patientId || visit.patientId;
  visit.condition = condition || visit.condition;
  visit.prescription = prescription || visit.prescription;
  visit.paymentStatus = paymentStatus || visit.paymentStatus;
  visit.totalAmount = totalAmount || visit.totalAmount;
  visit.isDoctorVisiting = isDoctorVisiting || visit.isDoctorVisiting;

  await visit.save();
  return res.status(200).json({
    success: true,
    visit,
    msg: "Visit updated",
  });
};

const getAllReviews = async (req, res) => {
  const reviews = await VisitModel.find(
    {},
    { "review.rating": 1, "review.description": 1, _id: 0 }
  );

  res.status(200).json({
    success: true,
    reviews: reviews.filter((r) => Object.keys(r._doc).length !== 0),
  });
};

export {
  addVisit,
  addPaymentForVisit,
  addReview,
  searchVisitByPRN,
  searchUnpaidOrPendingStatusVisit,
  searchVisitsByDoctorId,
  searchVisit,
  updateVisit,
  getAllReviews,
};
