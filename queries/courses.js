import { replaceMongoIdArray, replaceMongoIdInObject } from "@/lib/convertData";
import { Category } from "@/model/category-model";
import { Course } from "@/model/course-model";
import { Module } from "@/model/module-model";
import { Testimonial } from "@/model/testimonial-model";
import { User } from "@/model/user-model";
import { getEnrollmentForCourse } from "./enrollments";
import { getTestimonialForCourse } from "./testimonial";
import { Lesson } from "@/model/lesson-model";
import { Quizset } from "@/model/quizset-model";
import { Quiz } from "@/model/quizzes-model";

export async function getCourseList() {
  const course = await Course.find({active:true})
    .select([
      "title",
      "subtitle",
      "thumbnail",
      "modules",
      "price",
      "category",
      "instructor",
    ])
    .populate({
      path: "category",
      model: Category,
    })
    .populate({
      path: "instructor",
      model: User,
    })
    .populate({
      path: "testimonials",
      model: Testimonial,
    })
    .populate({
      path: "modules",
      model: Module,
    })
    .lean();
  return replaceMongoIdArray(course);
}

export async function getCourseDetails(id) {
  const course = await Course.findById(id)
    .populate({
      path: "category",
      model: Category,
    })
    .populate({
      path: "instructor",
      model: User,
    })
    .populate({
      path: "testimonials",
      model: Testimonial,
      populate: {
        path: "user",
        model: User,
      },
    })
    .populate({
      path: "modules",
      model: Module,
      populate:{
        path:"lessonIds",
        model:Lesson
      }
    
    })
    .populate({
      path:"quizSet",
      model:Quizset,
      populate:{
        path:"quizIds",
        model:Quiz
      }
    })
    .lean();
  return replaceMongoIdInObject(course);
}

export async function getCourseDetailsByInstructor(instructorId, expend) {
  const publishedCourses = await Course.find({ instructor: instructorId, active:true }).lean();

  const enrollments = await Promise.all(
    publishedCourses.map(async (course) => {
      const enrollment = await getEnrollmentForCourse(course._id.toString());
      return enrollment;
    })
  );

  const groupByCourses = Object.groupBy(
    enrollments.flat(),
    ({ course }) => course
  );

  const totalRevenue = publishedCourses.reduce((acc, course) => {
    const quantity = groupByCourses[course?._id]? groupByCourses[course?._id].length : 0
    return (acc + quantity * course.price)
  }, 0);



  const totalEnrollment = enrollments.reduce((acc, obj) => {
    return acc + obj.length;
  }, 0);

  const testimonials = await Promise.all(
    publishedCourses.map(async (course) => {
      const testimonial = await getTestimonialForCourse(course._id.toString());
      return testimonial;
    })
  );
  const totalTestimonial = testimonials.flat();
  const avgRating =
    totalTestimonial.reduce((acc, cur) => {
      return acc + cur.rating;
    }, 0) / totalTestimonial.length;


    if(expend ){
      const allCourses = await Course.find({instructor: instructorId}).lean()
      return {
        "courses":allCourses.flat(),
        "enrollments":enrollments.flat(),
        "reviews": totalTestimonial
      }
    }


  return {
    courses: publishedCourses.length,
    enrollments: totalEnrollment,
    reviews: totalTestimonial.length,
    ratings: avgRating.toPrecision(2),
    revenue: totalRevenue,
  };
}



export async function create(coursedata) {
  try {
    const course = await Course.create(coursedata)
    return JSON.parse(JSON.stringify(course))
    
  } catch (e) {
    throw new Error(e)
  }
  
}