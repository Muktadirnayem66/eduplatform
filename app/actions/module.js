"use server"

import { Course } from "@/model/course-model"
import { Module } from "@/model/module-model"
import { create } from "@/queries/module"
import mongoose from "mongoose"

export async function createModule(data) {
    try {
        const title = data.get("title")
        const slug = data.get("slug")
        const courseId = data.get("courseId")
        const order = data.get("order")
        const createmodule = await create({title, slug, course:courseId,order})
        const course = await Course.findById(courseId) 
        course.modules.push(createmodule._id)
        course.save()
        return createModule
    } catch (err) {
        throw new Error(err)
    }
    
}



export async function reOrderModules(data) {
    try {

        await Promise.all(data.map(async(element)=>{
            await Module.findByIdAndUpdate(element.id, {order:element.position})
        }))
        
        
    } catch (err) {
        throw new Error(err)
        
    }
    
}


export async function updateModule(moduleId, data) {
    try {
        await Module.findByIdAndUpdate(moduleId, data)
        
    } catch (err) {
        throw new Error(err)
    }
    
}


export async function changeModulePublishState(moduleId) {

    const modules = await Module.findById(moduleId)
    try {
        
        const res = await Module.findByIdAndUpdate(moduleId, {active: !modules.active}, {lean:true})
        return res.active
    } catch (err) {
        throw new Error(err)
    }
}

export async function deleteModule(moduleId, courseId) {
    try {
        const course = await Course.findById(courseId)
        course.modules.pull(new mongoose.Types.ObjectId(moduleId))
        course.save()
        await Module.findByIdAndDelete(moduleId) 
               
    } catch (err) {
        throw new Error(err)
    }
}