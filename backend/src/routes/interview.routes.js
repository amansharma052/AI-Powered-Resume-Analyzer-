import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/file.middleware.js";
import {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
} from "../controllers/interview.controller.js";

const interviewRouter = express.Router();

// POST /api/interview  — generate a new interview report
interviewRouter.post("/", authUser, upload.single("resume"), generateInterViewReportController);

// GET /api/interview/report/:interviewId — get a specific report
interviewRouter.get("/report/:interviewId", authUser, getInterviewReportByIdController);

// GET /api/interview — get all reports for logged-in user
interviewRouter.get("/", authUser, getAllInterviewReportsController);

// POST /api/interview/resume/pdf/:interviewReportId — generate resume PDF
interviewRouter.post("/resume/pdf/:interviewReportId", authUser, generateResumePdfController);

export default interviewRouter;