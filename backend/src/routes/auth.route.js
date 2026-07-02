import express from "express";
import authcontroller from "../controllers/auth.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", authcontroller.register);
authRouter.post("/login", authcontroller.login);
authRouter.get("/logout", authcontroller.logout);
authRouter.get("/me", authUser, authcontroller.getMe);

export default authRouter;