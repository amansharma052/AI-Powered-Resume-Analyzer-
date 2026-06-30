import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/file.middleware.js";
import { generateInterViewReportController } from "../controllers/interview.controller.js";

const interviewRouter = express.Router();

// POST /interview
interviewRouter.post("/",authUser,upload.single("resume"),generateInterViewReportController);

export default interviewRouter;