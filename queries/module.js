import { replaceMongoIdInObject } from "@/lib/convertData"
import { Lesson } from "@/model/lesson-model"
import { Module } from "@/model/module-model"



export async function create(moduleData) {
    try {
        const modules = await Module.create(moduleData)
        return JSON.parse(JSON.stringify(modules))

        
    } catch (err) {
        throw new Error(err)
    }
}


export async function getModule(moduleId) {
    try {

        const modules = await Module.findById(moduleId).
        populate({
            path:"lessonIds",
            model:Lesson
        }).lean()
        return replaceMongoIdInObject(modules)
    } catch (err) {
        throw new Error(err)
        
    }
    
}