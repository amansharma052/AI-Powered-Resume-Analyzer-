import userModel from "../models/user.model.js"
import bcrypt, { compare } from "bcryptjs"

import config from "../config/config.js"
import tokenBlackListModel from "../models/token.model.js"
import  jwt from "jsonwebtoken"

export async function register(req,res){
    const{username,email,password}=req.body

    const isUserExist = await userModel.findOne({
        $or:[{username},{email}]
    })

    if(isUserExist){
        return res.status(200).json({
            message:"user already register"
        })
    }

    const hashedPassword = await bcrypt.hash(password,10)
    const user = await userModel.create({
        username,
        email,
        password:hashedPassword
    })
   
    const token = jwt.sign({
        id:user._id,
        username:user.username
    },
    config.JWT_SECRET)

    res.cookie("token", token)


    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}

export async function login(req,res){
    const{email,password}=req.body

    const user =await userModel.findOne({email})
    if(!user){
        return res.status(400).json({
            message:"user not found by  email"
        })
    }

    const comparePassword = await compare( password,user.password)

    if(!comparePassword){
        return res.status(401).json({
            message:"invalid password"
        })
    }
     const token = jwt.sign({
        id:user._id,
        username:user.username
    },
    config.JWT_SECRET)

    res.cookie("token", token)


    res.status(200).json({
        message: "User login successfully",
        user: {
            id: user._id,
            email: user.email
        }
    })



    

}

export async function logout(req,res){
    const token =req.cookies.token

    if(token){
        await tokenBlackListModel.create({token})
    }
    res.clearCookie("token")

    res.status(200).json({
        message:"user logout successfully"
    })
}
export default {register,login,logout}