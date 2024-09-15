"use server";

import { getSlug } from "@/lib/convertData";
import { Quizset } from "@/model/quizset-model";
import { createQuiz } from "@/queries/quizzes";

export async function updateQuizSet(quizset, dataToUpdate) {
  try {
    await Quizset.findByIdAndUpdate(quizset, dataToUpdate);
  } catch (err) {
    throw new Error(err);
  }
}


export async function addQuizToQuizSet(quizSetId, quizData) {
  try {
  

    const transformedQuizData = {};

    transformedQuizData["title"] = quizData["title"];
    transformedQuizData["description"] = quizData["description"];
    transformedQuizData["slug"] = getSlug(quizData["title"]);
    transformedQuizData["options"] = [
        {
            text: quizData.optionA.label,
            is_correct: quizData.optionA.isTrue,
        },
        {
            text: quizData.optionB.label,
            is_correct: quizData.optionB.isTrue,
        },
        {
            text: quizData.optionC.label,
            is_correct: quizData.optionC.isTrue,
        },
        {
            text: quizData.optionD.label,
            is_correct: quizData.optionD.isTrue,
        },
    ];

    
    const createdQuizId = await createQuiz(transformedQuizData);
    

    const quizSet = await Quizset.findById(quizSetId);
    quizSet.quizIds.push(createdQuizId);
    quizSet.save();
} catch (e) {
    throw new Error(e);
}
}