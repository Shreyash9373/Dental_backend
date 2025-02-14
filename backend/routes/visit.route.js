import express from "express";

import { AsyncErrorHandler } from "../utils/AsyncErrorHandler.js";
import {
  getVisit,
  getDoctors,
  addPaymentForVisit,
  getReview,
  addReview,
  addVisit,
  deleteVisit,
  searchVisit,
  searchUnpaidOrPendingStatusVisit,
  searchVisitByPatientId,
  searchVisitsByDoctorId,
  updateVisit,
  getAllReviews,
  deletePaymentForVisit,
} from "../controllers/visit.controller.js";

const visitRouter = express.Router();

// Prefix: /api/visits
// get visit
visitRouter.get("/visit/:visitId", AsyncErrorHandler(getVisit));
// get visit
visitRouter.get("/doctors", AsyncErrorHandler(getDoctors));

// add visit
visitRouter.post("/", AsyncErrorHandler(addVisit));

// delete visit
visitRouter.delete("/:visitId", AsyncErrorHandler(deleteVisit));

// get review
visitRouter.get("/:visitId/review", AsyncErrorHandler(getReview));

// add review
visitRouter.post("/:visitId/review", AsyncErrorHandler(addReview));

// add payment
visitRouter.post("/payment/:visitId", AsyncErrorHandler(addPaymentForVisit));

// delete payment
visitRouter.delete(
  "/payment/:visitId",
  AsyncErrorHandler(deletePaymentForVisit)
);

// search visits for a particular patient (patient history)
visitRouter.get(
  "/patient/:patientId",
  AsyncErrorHandler(searchVisitByPatientId)
);

// search visits for a particular doctor
visitRouter.get("/doctor/:doctorId", AsyncErrorHandler(searchVisitsByDoctorId));

// search for visits with pending status
visitRouter.get(
  "/pending",
  AsyncErrorHandler(searchUnpaidOrPendingStatusVisit)
);

// search for visits based on prescription or condition
visitRouter.get("/search", AsyncErrorHandler(searchVisit));

// update visit
visitRouter.put("/:visitId", AsyncErrorHandler(updateVisit));

// get all reviews
visitRouter.get("/review", AsyncErrorHandler(getAllReviews));

export default visitRouter;
