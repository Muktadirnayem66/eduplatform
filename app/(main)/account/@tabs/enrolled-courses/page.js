import { redirect } from "next/navigation";
import EnrolledCourseCard from "../../component/enrolled-courseCard";

import { auth } from "@/auth";
import { getUserByEmail } from "@/queries/users";
import { getEnrollmentsForUser } from "@/queries/enrollments";
import Link from "next/link";

async function EnrolledCourses() {
	const session = await auth()

	if(!session?.user){
		redirect("/login")
	}

	const loggedInUser = await getUserByEmail(session?.user?.email)
	const enrollments = await getEnrollmentsForUser(loggedInUser?.id)
	
	
	return (
		<div className="grid sm:grid-cols-2 gap-6">

			{
				enrollments && enrollments.length > 0 ? (
					<>
					{
						enrollments.map((enrollment)=>(
							<Link href={`/courses/${enrollment.course._id.toString()}/lesson`}
							 key={enrollment?.id}>
							<EnrolledCourseCard  enrollment={enrollment}/>
							</Link>
						))
					}
					</>
				) : (
					<p>No Enrollments found</p>
				)
			}
			
			
		</div>
	);
}

export default EnrolledCourses;