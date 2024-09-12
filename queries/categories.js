import { replaceMongoIdArray, replaceMongoIdInObject } from "@/lib/convertData";
import { Category } from "@/model/category-model";


export async function getAllCategories(){
    const categories = await Category.find({}).lean()
    return replaceMongoIdArray(categories)
}


export async function getCategoriesDetails(categoryId) {
    try {
        const category = await Category.findById(categoryId).lean()
    return replaceMongoIdInObject(category)
        
    } catch (error) {
        throw new Error(error)
    }
    
}