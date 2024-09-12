import mongoose from "mongoose";



export async function dbConnect(){
    try {
        const conn = await mongoose.connect(String(process.env.MONGODB_CONNECTION_STRING))
        console.log("Database connection successful");
        
        return conn
    } catch (error) {
        console.log(error);
        
    }

}