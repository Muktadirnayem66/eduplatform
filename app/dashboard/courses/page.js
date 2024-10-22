
import {COURSE_DATA, getInstructorDashbordData } from "@/lib/dashbord-helper";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

const CoursesPage = async () => {
  const courses = await getInstructorDashbordData(COURSE_DATA);

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;
