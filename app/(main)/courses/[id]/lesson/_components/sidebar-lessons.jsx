import { AccordionContent } from "@/components/ui/accordion";
import { SidebarLessonItem } from "./sidebar-lesson-items";
import { replaceMongoIdArray } from "@/lib/convertData";

export const SidebarLessons = ({courseId, module, lessons}) => {
    const allLessons = replaceMongoIdArray(lessons).toSorted(
        (a, b) => a.order - b.order
      );
    return (
        <AccordionContent>
            <div className="flex flex-col w-full gap-3">
                {
                    allLessons.map((lesson)=>(

                        <SidebarLessonItem key={lesson.id} courseId={courseId} lesson={lesson} module={module} />
                    ))
                }
            </div>
        </AccordionContent>
    );
};