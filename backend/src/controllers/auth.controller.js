import userModel from "../models/user.model.js"
import bcrypt, { compare } from "bcryptjs"
import config from "../config/config.js"
import tokenBlackListModel from "../models/token.model.js"
import jwt from "jsonwebtoken"

export async function register(req, res) {
    try {
        const { username, email, password } = req.body

        const isUserExist = await userModel.findOne({
            $or: [{ username }, { email }]
        })

        if (isUserExist) {
            return res.status(409).json({
                message: "A user with that username or email already exists."
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await userModel.create({ username, email, password: hashedPassword })

        const token = jwt.sign(
            { id: user._id, username: user.username },
            config.JWT_SECRET,
            { expiresIn: "7d" }
        )

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(201).json({
            message: "User registered successfully",
            user: { id: user._id, username: user.username, email: user.email }
        })
    } catch (err) {
        console.error("register error:", err)
        res.status(500).json({ message: "Registration failed." })
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." })
        }

        const isMatch = await compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password." })
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            config.JWT_SECRET,
            { expiresIn: "7d" }
        )

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            message: "User logged in successfully",
            user: { id: user._id, username: user.username, email: user.email }
        })
    } catch (err) {
        console.error("login error:", err)
        res.status(500).json({ message: "Login failed." })
    }
}

export async function logout(req, res) {
    try {
        const token = req.cookies.token
        if (token) {
            await tokenBlackListModel.create({ token })
        }
        res.clearCookie("token")
        res.status(200).json({ message: "User logged out successfully." })
    } catch (err) {
        console.error("logout error:", err)
        res.status(500).json({ message: "Logout failed." })
    }
}

export async function getMe(req, res) {
    try {
        const user = await userModel.findById(req.user.id).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User not found." })
        }
        res.status(200).json({ user })
    } catch (err) {
        console.error("getMe error:", err)
        res.status(500).json({ message: "Failed to fetch user." })
    }
}

export default { register, login, logout, getMe }