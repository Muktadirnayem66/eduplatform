import { replaceMongoIdArray } from "@/lib/convertData";
import { Testimonial } from "@/model/testimonial-model";





export async function getTestimonialForCourse(courseId){
    const testimonials = await Testimonial.find({courseId: courseId}).lean()
    
    return replaceMongoIdArray(testimonials);
    
}