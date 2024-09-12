import { auth } from "@/auth";
import { getCourseDetails, getCourseDetailsByInstructor } from "@/queries/courses";
import { getAReport } from "@/queries/reports";
import { getUserByEmail, getUserDetails } from "@/queries/users";

export const REVIEW_DATA = "review";
export const COURSE_DATA = "course";
export const ENROLLMENT_DATA = "enrollment";


const populateReviewData = async(reviews)=>{

   const populatedReviews = await Promise.all(
      reviews.map(async(review)=>{
         const student = await getUserDetails(review?.user?._id)      
         review["studentName"] = `${student?.firstName} ${student?.lastName}`
         return review
      })
   )
   return populatedReviews
}

const populateEnrollmentData = async(enrollments)=>{
  const populatedEnrollments = await Promise.all(
    enrollments.map(async(enrollment)=>{
       const student = await getUserDetails(enrollment?.student?._id)  
       console.log(student);
           
       enrollment["studentName"] = `${student?.firstName} ${student?.lastName}`;
       enrollment["studentEmail"] = student?.email;
      const filter = {
        course: enrollment?.course?._id,
        student:enrollment?.student?._id
      }

      const report = await getAReport(filter)
      enrollment["progress"] = 0
      enrollment["quizMark"] = 0

      if(report){

        //progress

        const course = await getCourseDetails(enrollment?.course?._id)
        const totalModeules = course?.modules?.length;
        const totalCompletedModules = report?.totalCompletedModeules?.length;
        const progress = (totalCompletedModules/ totalModeules) * 100;
        enrollment["progress"] = progress

        //calculate quiz mark - 
        const quizzes = report?.quizAssessment?.assessments;
        const quizzesTaken = quizzes.filter(q=>q.attempted)
        const totalCorrect = quizzesTaken.map((quiz)=>{
          const item = quiz.options
          return item.filter(o=>{
            return o.isCorrect === true && o.isSelected === true
          })
        }).filter(elem=>elem.length>0).flat();
        const marksFromQuizees = totalCorrect.length * 5;
        enrollment["quizMark"] = marksFromQuizees
      }

       return enrollment
    })
 )
 return populatedEnrollments

}

export async function getInstructorDashbordData(datatype) {
  try {
    const session = await auth();
    const instructor = await getUserByEmail(session?.user?.email);
    const data = await getCourseDetailsByInstructor(instructor?.id, true);
    switch (datatype) {
      case REVIEW_DATA:
        return populateReviewData(data?.reviews);
      case COURSE_DATA:
        return data?.courses;
      case ENROLLMENT_DATA:
        return populateEnrollmentData(data?.enrollments)

      default:
        return data;
    }
  } catch (error) {
    throw new Error(error);
  }
}
