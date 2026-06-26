import express from "express";
import authcontroller from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", authcontroller.register);
authRouter.post("/login", authcontroller.login);
authRouter.get("/logout", authcontroller.logout);

export default authRouter;