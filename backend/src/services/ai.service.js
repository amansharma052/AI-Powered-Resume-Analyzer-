import { GoogleGenAI } from "@google/genai";
import * as z from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
});


// ── Schema for Interview Report ───────────────────────────────────────────────

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question that can be asked in the interview"),
        intention: z.string().describe("The intention of the interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question — what points to cover, what approach to take, etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question that can be asked in the interview"),
        intention: z.string().describe("The intention of the interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question — what points to cover, what approach to take, etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of this skill gap — how important it is for the role")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day, e.g. data structures, system design, mock interviews"),
        tasks: z.array(z.string()).describe("List of tasks to do on this day")
    })).describe("A day-wise preparation plan for the candidate to prepare effectively for the interview"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
});


// ── Generate Interview Report ─────────────────────────────────────────────────

export async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate an interview report for a candidate with the following details:
Resume: ${resume || "Not provided"}
Self Description: ${selfDescription || "Not provided"}
Job Description: ${jobDescription}
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    });

    return JSON.parse(response.text);
}


// ── Generate Resume PDF ───────────────────────────────────────────────────────

const resumeContentSchema = z.object({
    name: z.string().describe("Full name of the candidate"),
    summary: z.string().describe("A professional summary paragraph tailored to the job description"),
    skills: z.array(z.string()).describe("List of key technical and soft skills"),
    experience: z.array(z.object({
        title: z.string(),
        company: z.string(),
        duration: z.string(),
        bullets: z.array(z.string()).describe("Key achievements and responsibilities")
    })).describe("Work experience entries"),
    education: z.array(z.object({
        degree: z.string(),
        institution: z.string(),
        year: z.string()
    })).describe("Education entries"),
    projects: z.array(z.object({
        name: z.string(),
        description: z.string(),
        technologies: z.array(z.string())
    })).describe("Notable projects")
});

export async function generateResumePdf({ resume, jobDescription, selfDescription }) {
    const prompt = `Based on the following candidate information, generate a polished, ATS-optimised resume tailored to the job description.
Resume Content: ${resume || "Not provided"}
Self Description: ${selfDescription || "Not provided"}
Target Job Description: ${jobDescription}
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumeContentSchema),
        }
    });

    const data = JSON.parse(response.text);

    // Build a clean text-based PDF using a minimal HTML → Buffer approach
    const html = buildResumeHtml(data);
    // Return the HTML as a UTF-8 buffer — the browser will receive it as a downloadable file.
    // (A full PDF renderer like puppeteer is not installed; this returns an HTML file
    //  with Content-Type application/pdf which can be opened in most browsers.)
    return Buffer.from(html, "utf-8");
}

function buildResumeHtml(data) {
    const skills = data.skills.map(s => `<span class="skill">${s}</span>`).join("");

    const experience = data.experience.map(exp => `
        <div class="section-item">
            <div class="item-header">
                <strong>${exp.title}</strong> — ${exp.company}
                <span class="duration">${exp.duration}</span>
            </div>
            <ul>${exp.bullets.map(b => `<li>${b}</li>`).join("")}</ul>
        </div>`).join("");

    const education = data.education.map(edu => `
        <div class="section-item">
            <strong>${edu.degree}</strong> — ${edu.institution} (${edu.year})
        </div>`).join("");

    const projects = data.projects.map(proj => `
        <div class="section-item">
            <strong>${proj.name}</strong>: ${proj.description}
            <div class="tech-stack">${proj.technologies.join(", ")}</div>
        </div>`).join("");

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>${data.name} — Resume</title>
<style>
  body { font-family: 'Segoe UI', sans-serif; max-width: 800px; margin: 40px auto; color: #1a1a1a; line-height: 1.6; }
  h1 { font-size: 2rem; margin-bottom: 0.25rem; }
  h2 { font-size: 1.1rem; color: #c0003c; border-bottom: 2px solid #c0003c; padding-bottom: 4px; margin-top: 1.5rem; }
  .summary { color: #444; margin-bottom: 1rem; }
  .skills { display: flex; flex-wrap: wrap; gap: 8px; margin: 0.5rem 0; }
  .skill { background: #f0f0f0; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; }
  .section-item { margin-bottom: 1rem; }
  .item-header { display: flex; justify-content: space-between; }
  .duration { color: #666; font-size: 0.9rem; }
  ul { margin: 0.25rem 0 0 1.5rem; }
  li { margin-bottom: 0.2rem; font-size: 0.9rem; }
  .tech-stack { color: #666; font-size: 0.85rem; margin-top: 4px; }
  @media print { body { margin: 20px; } }
</style>
</head>
<body>
  <h1>${data.name}</h1>
  <p class="summary">${data.summary}</p>
  <h2>Skills</h2>
  <div class="skills">${skills}</div>
  <h2>Experience</h2>
  ${experience}
  <h2>Education</h2>
  ${education}
  ${projects ? `<h2>Projects</h2>${projects}` : ""}
</body>
</html>`;
}

export default generateInterviewReport;