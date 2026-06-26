import mongoose from "mongoose"

const tokenBlackListSchema = new mongoose.Schema({
    token:{
        require:true,
        type:String
    }
})

const tokenBlackListModel= mongoose.model("tokenBlacklist",tokenBlackListSchema)

export default tokenBlackListModel