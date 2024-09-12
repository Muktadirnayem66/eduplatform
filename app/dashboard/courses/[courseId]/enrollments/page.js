import { getCourseDetails } from "@/queries/courses";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { ENROLLMENT_DATA, getInstructorDashbordData } from "@/lib/dashbord-helper";


const EnrollmentsPage = async ({params:{courseId}}) => {
  const course = await getCourseDetails(courseId)
  const allEnrollments = await getInstructorDashbordData(ENROLLMENT_DATA)
  const enrollmentForCourse = allEnrollments.filter((enrollment)=>enrollment?.course.toString() == courseId)
  console.log(enrollmentForCourse);
  
  return (
    <div className="p-6">
     
      <h2>{course?.title}</h2>
      <DataTable columns={columns} data={enrollmentForCourse} />
    </div>
  );
};

export default EnrollmentsPage;