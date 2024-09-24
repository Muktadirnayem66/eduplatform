import { replaceMongoIdInObject } from "@/lib/convertData";
import { Lesson } from "@/model/lesson-model";



export async function getLesson(lessonId) {
    const lesson = await Lesson.findById(lessonId).lean()
    return replaceMongoIdInObject(lesson)
}


export async function create(LessionData) {
    try {
        const lesson = await Lesson.create(LessionData)
        return JSON.parse(JSON.stringify(lesson))
        
    } catch (err) {
        throw new Error(err)
    }
    
}


export async function getLessonBySlug(slug) {
    try {
        
        const lesson = await Lesson.findOne({slug:slug}).lean()

        return replaceMongoIdInObject(lesson)
    } catch (err) {

        throw new Error(err)
        
    }
    
}