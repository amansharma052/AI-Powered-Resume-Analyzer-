import app from"./src/app.js"
import connectDB from "./src/config/db.js"

import generateInterviewReport from"./src/services/ai.service.js"

app.listen(3000,()=>{
    console.log("server is running on port 3000")
})
connectDB()
generateInterviewReport({
    resume: "My Resume",
    selfDescription: "I am a MERN developer",
    jobDescription: "Looking for MERN developer"
});
