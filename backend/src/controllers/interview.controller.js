import generateInterviewReport from "../services/ai.service.js"
import * as pdfParse from "pdf-parse";
import interviewReportModel from "../models/interviewReport.model.js"




export async function generateInterViewReportController(req,res){
    const {title,selfDescription,jobDescription}=req.body 
    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()

    const interViewReportByAi = generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })
const interviewReport = await interviewReportModel.create({
    user: req.user.id,
    title,
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    ...interViewReportByAi
});
    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })



}



export default(generateInterViewReportController)