import { replaceMongoIdArray, replaceMongoIdInObject } from "@/lib/convertData"
import { Quizset } from "@/model/quizset-model"
import { Quiz } from "@/model/quizzes-model"



export async function getAllQuizSets(exludeUnPublished) {
    
    try {
        let quizSets = []
        if(exludeUnPublished){
            quizSets = await Quizset.find({active:true}).lean()
        }else{
            quizSets = await Quizset.find().lean()
        }
        return replaceMongoIdArray(quizSets)
        
    } catch (err) {
        throw new Error(err)
    }
}

export async function getQuizSetById(id) {
    try {
        const quizSet = await Quizset.findById(id).populate({
            path:"quizIds",
            model:Quiz
        }).lean()
        
        return replaceMongoIdInObject(quizSet)
    } catch (err) {
        throw new Error(e)
    }
    
}

export async function createQuiz(quizData) {
    try {
        
        const quiz = await Quiz.create(quizData)
        return quiz._id.toString()
    } catch (err) {
        throw new Error(err)
    }
    
}