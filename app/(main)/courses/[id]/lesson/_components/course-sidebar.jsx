
import { CourseProgress } from "@/components/course-progress";

import { GiveReview } from "./give-review";
import { DownloadCertificate } from "./download-certificate";
import { SidebarModules } from "./sidebar-modules";
import { getCourseDetails } from "@/queries/courses";
import { Watch } from "@/model/watch-model";
import { getLoggedInUser } from "@/lib/loggedin-user";
import { getAReport } from "@/queries/reports";
import { Quiz } from "./Quiz";

export const CourseSidebar = async ({courseId}) => {

  const course = await getCourseDetails(courseId)
  const loggedInUser = await getLoggedInUser()

  const report = await getAReport({courseId: courseId, student:loggedInUser.id })

  const totalCompletedModules = report?.totalCompletedModeules ? report?.totalCompletedModeules.length : 0
  const totalModules = course?.modules ? course?.modules.length : 0

  const totalProgress = (totalModules > 0) ? (totalCompletedModules/totalModules) * 100 : 0

  const updatedModules = await Promise.all(course.modules.map(async(modules)=>{
    const moduleId = modules._id.toString()
    const lessons = modules?.lessonIds;
    const updatedLessons = await Promise.all(lessons.map(async(lesson)=>{
        const lessonIds = lesson._id.toString()
        const watch = await Watch.findOne({lesson:lessonIds, module:moduleId, user:loggedInUser.id})

        if(watch?.state === "completed"){
            lesson.state = "completed"
        }
        return lesson
    }))
    return modules
  }))

  const quizSet = course?.quizSet
  const isQuizComplete = report?.quizAssessment ? true : false;

  return (
      <>
          <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
              <div className="p-8 flex flex-col border-b">
                  <h1 className="font-semibold">Reactive Accelerator</h1>
                  <div className="mt-10">
                      <CourseProgress variant="success" value={totalProgress} />
                  </div>
              </div>

              <SidebarModules courseId={courseId} modules={updatedModules} />
               {quizSet &&  <Quiz courseId={courseId} quizSet={quizSet} isTaken={isQuizComplete}/>}
              <div className="w-full px-6">
                  <DownloadCertificate courseId={courseId} totalProgress={totalProgress} />
                  <GiveReview courseId={courseId} />
              </div>
          </div>
      </>
  );
};