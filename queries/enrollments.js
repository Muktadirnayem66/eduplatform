import { replaceMongoIdArray } from "@/lib/convertData";
import { Course } from "@/model/course-model";
import { Enrollment } from "@/model/enrollment-model";



export async function getEnrollmentForCourse(courseId){
    const enrollments = await Enrollment.find({course: courseId}).lean()
    

    
    return replaceMongoIdArray(enrollments)
}


export async function getEnrollmentsForUser(userId) {
    try {
        const enrollments = await Enrollment.find({student:userId}).populate({
            path:"course",
            model:Course
        }).lean()
        return replaceMongoIdArray(enrollments)

    } catch (error) {
        throw new Error(error)
    }
}


export async function enrollForCourse(courseId, userId, paymentMethod) {

    const newEnrollment = {
        course:courseId,
        student:userId,
        method:paymentMethod,
        enrollment_date: Date.now(),
        status:"not-started"
    }
    try {
        const response = await Enrollment.create(newEnrollment)
        return response
    } catch (error) {
        throw new Error(error)
    }
    
}


export async function hasEnrollmentForCourse(courseId, studentId) {

    try {
        const enrollment = await Enrollment.findOne({
            course:courseId,
            student:studentId
        }).populate({
            path:"course",
            model:Course
        }).lean()

        if(!enrollment){
            return false
        }
        return true
        
    } catch (error) {
        throw new Error(error)
    }
    
}
