"use server"

import { getLoggedInUser } from "@/lib/loggedin-user"
import { Course } from "@/model/course-model"
import { create } from "@/queries/courses"



export async function createCourse(data) {

    try {
        const loggedinUser = await getLoggedInUser()
        data["instructor"] = loggedinUser?.id
        const course = await create(data)
        return course
        
    } catch (e) {
       throw new Error(e) 
    }
    
}


export async function updateCourse(courseId, courseData) {
    try {
        await Course.findByIdAndUpdate(courseId, courseData)
        
    } catch (error) {
        throw new Error(error)
    }
    
}