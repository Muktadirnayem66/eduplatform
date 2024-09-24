
import { CourseProgress } from "@/components/course-progress";

import { GiveReview } from "./give-review";
import { DownloadCertificate } from "./download-certificate";
import { SidebarModules } from "./sidebar-modules";
import { getCourseDetails } from "@/queries/courses";
import { Watch } from "@/model/watch-model";
import { getLoggedInUser } from "@/lib/loggedin-user";

export const CourseSidebar = async ({courseId}) => {

  const course = await getCourseDetails(courseId)
  const loggedInUser = await getLoggedInUser()

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

  

  return (
      <>
          <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
              <div className="p-8 flex flex-col border-b">
                  <h1 className="font-semibold">Reactive Accelerator</h1>
                  <div className="mt-10">
                      <CourseProgress variant="success" value={80} />
                  </div>
              </div>

              <SidebarModules courseId={courseId} modules={updatedModules} />

              <div className="w-full px-6">
                  <DownloadCertificate courseId={courseId} />
                  <GiveReview courseId={courseId} />
              </div>
          </div>
      </>
  );
};