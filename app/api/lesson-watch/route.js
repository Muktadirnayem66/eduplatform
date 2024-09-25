import { getLoggedInUser } from "@/lib/loggedin-user";
import { Watch } from "@/model/watch-model";
import { getLesson } from "@/queries/lesson";
import { getModuleBySlug } from "@/queries/module";
import { createWatchReport } from "@/queries/reports";
import { NextResponse } from "next/server";




const STARTED = "started";
const COMPLETED = "completed";


async function updateReport(userId, courseId, moduleId, lessonId) {
    try {
        createWatchReport({userId, courseId, moduleId, lessonId})
    } catch (err) {
        throw new Error(err);
    }
}


export async function POST(request) {
    const {courseId, lessonId,moduleSlug, state, lastTime, } = await request.json()

    const lesson = await getLesson(lessonId)
    const loggedInUser = await getLoggedInUser()
    const modules = await getModuleBySlug(moduleSlug)

    if(!loggedInUser){
     return new NextResponse("you are not authenticated", {
        status:401
     })
    }


    if( state !== STARTED && state !== COMPLETED){
        return new NextResponse("Invalid state, can not process request",{
            status:500
        })
    }

    
    if (!lesson) {
        return new NextResponse(`Invalid lesson. Can not process request.`, {
            status: 500,
        });
    }

    const watchEntry = {
        lastTime,
        lesson:lesson.id,
        module:modules.id,
        user:loggedInUser.id,
        state

    }

    try {
             const found = await Watch.findOne({
            lesson: lessonId,
            module: modules.id,
            user: loggedInUser.id,
        }).lean();

        if (state === STARTED) {
            if (!found) {
                watchEntry["created_at"] = Date.now();
                await Watch.create(watchEntry);
               
            }
        } else if (state === COMPLETED) {
            if (!found) {
                watchEntry["created_at"] = Date.now();
                await Watch.create(watchEntry);
                await updateReport(loggedInUser.id, courseId, modules.id, lessonId)

            } else {
                if (found.state === STARTED) {
                    watchEntry["modified_at"] = Date.now();
                    await Watch.findByIdAndUpdate(found._id, {
                        state: COMPLETED,
                    });
                    await updateReport(loggedInUser.id, courseId, modules.id, lessonId)
                }
            }
        }
        return new NextResponse("Watch Record added Successfully.", {
            status: 200,
        });
        
    } catch (err) {
      throw new Error(err)
      return new NextResponse(err.message,{
        status:500
      })  
    }
}