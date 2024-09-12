import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    subtitle:{
        type:String
    },
    description:{
        type: String,
        required: true
    },
    thumbnail:{
        type: String,
        
    },
    modules:[
        {
            type: Schema.ObjectId,
            ref:"Module"
        }
    ],
    price:{
        required: true,
        default:0,
        type: Number
    },
    active:{
        required: true,
        type: Boolean,
        default: false
    },
    category:{
        ref:"Category",
        type:Schema.ObjectId
    },
    instructor:{
        ref:"User",
        type: Schema.ObjectId
    },
    testimonials:[
        {
            type:Schema.ObjectId,
            ref:"Testimonial"
            
        }
    ],
    quizSet:{
        required: false,
        type:Schema.ObjectId
    },
    learning: {
        type: [String]
      },
    
      createdOn: {
        required: true,
        default:Date.now(),
        type: Date
      },
    
      modifiedOn: {
        required: true,
        default:Date.now(),
        type: Date
      }

})

export const Course = mongoose.models.Course ?? mongoose.model("Course", courseSchema)