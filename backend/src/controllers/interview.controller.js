import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import {
  generateInterviewReport,
  generateResumePdf,
} from "../services/ai.service.js";
import interviewReportModel from "../models/interviewReport.model.js";


/**
 * @description Controller to generate an interview report from resume + job description.
 */
export async function generateInterViewReportController(req, res) {
  try {
    const { selfDescription, jobDescription } = req.body;

    // Resume is optional — user may only provide a self description
    let resumeText = "";
    if (req.file && req.file.buffer) {
      const pdfData = await pdfParse(req.file.buffer);
      resumeText = pdfData.text;
    }

    if (!resumeText && !selfDescription) {
      return res.status(400).json({
        message: "Either a resume file or a self description is required.",
      });
    }

    const interViewReportByAi = await generateInterviewReport({
      resume: resumeText,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: resumeText,
      selfDescription,
      jobDescription,
      ...interViewReportByAi,
    });

    res.status(201).json({
      message: "Interview report generated successfully.",
      interviewReport,
    });
  } catch (err) {
    console.error("generateInterViewReportController error:", err);
    res.status(500).json({ message: "Failed to generate interview report." });
  }
}


/**
 * @description Controller to get interview report by interviewId.
 */
export async function getInterviewReportByIdController(req, res) {
  try {
    const { interviewId } = req.params;

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found.",
      });
    }

    res.status(200).json({
      message: "Interview report fetched successfully.",
      interviewReport,
    });
  } catch (err) {
    console.error("getInterviewReportByIdController error:", err);
    res.status(500).json({ message: "Failed to fetch interview report." });
  }
}


/**
 * @description Controller to get all interview reports of logged in user.
 */
export async function getAllInterviewReportsController(req, res) {
  try {
    const interviewReports = await interviewReportModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select(
        "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan"
      );

    res.status(200).json({
      message: "Interview reports fetched successfully.",
      interviewReports,
    });
  } catch (err) {
    console.error("getAllInterviewReportsController error:", err);
    res.status(500).json({ message: "Failed to fetch interview reports." });
  }
}


/**
 * @description Controller to generate resume PDF.
 */
export async function generateResumePdfController(req, res) {
  try {
    const { interviewReportId } = req.params;

    const interviewReport = await interviewReportModel.findById(interviewReportId);

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found.",
      });
    }

    const { resume, jobDescription, selfDescription } = interviewReport;

    const pdfBuffer = await generateResumePdf({
      resume,
      jobDescription,
      selfDescription,
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("generateResumePdfController error:", err);
    res.status(500).json({ message: "Failed to generate resume PDF." });
  }
}