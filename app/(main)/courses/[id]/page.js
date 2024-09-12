import CourseDetailsIntro from "./_components/CourseDetailsIntro";
import CourseDetails from "./_components/CourseDetails";
import Testimonials from "./_components/Testimonials";
import RelatedCourse from "./_components/RelatedCourse";
import { getCourseDetails } from "@/queries/courses";
import { replaceMongoIdArray } from "@/lib/convertData";

const SingleCoursePage = async({params:{id}}) => {
  const course = await getCourseDetails(id)

  return (
    <>
      <CourseDetailsIntro course={course} />

      <CourseDetails course={course} />

      {course?.testimonials && <Testimonials testimonials={replaceMongoIdArray(course?.testimonials)} />}

      <RelatedCourse />
    </>
  );
};
export default SingleCoursePage;
