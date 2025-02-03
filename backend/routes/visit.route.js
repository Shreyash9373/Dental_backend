import express from "express";

import { AsyncErrorHandler } from "../utils/AsyncErrorHandler.js";
import {
  addPaymentForVisit,
  addReview,
  addVisit,
  searchVisit,
  searchUnpaidOrPendingStatusVisit,
  searchVisitByPRN,
  searchVisitsByDoctorId,
  updateVisit,
  getAllReviews,
} from "../controllers/visit.controller.js";

const visitRouter = express.Router();

// Prefix: /api/visits
// add visit
visitRouter.post("/", AsyncErrorHandler(addVisit));

// add review
visitRouter.post("/review/:visitId", AsyncErrorHandler(addReview));

// add payment
visitRouter.post("/payment/:visitId", AsyncErrorHandler(addPaymentForVisit));

// search visits for a particular patient (patient history)
visitRouter.get("/patient/:prn", AsyncErrorHandler(searchVisitByPRN));

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
