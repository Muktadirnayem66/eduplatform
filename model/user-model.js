import mongoose, { Schema } from "mongoose";


const userSchema = new Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    email:{
        required: true,
        type:String
    },
    phone:{
        type: String,
        required: false
    },
    role: {
        required: true,
        type: String,
    },
    bio: {
        required: false,
        type: String,
    },
    socialMedia: {
        required: false,
        type: Object
    },
    profilePicture: {
        required: false,
        type: String,
    },
    designation:{
        required: false,
        type: String,
    }

})


export const User = mongoose.models.User ?? mongoose.model("User", userSchema)