import { useParams } from "react-router-dom";
import CourseRating from "@/components/courses/CourseRating";

export default function CourseRatingPage() {
  const { courseId } = useParams();

  // PARAMETRIZADO: deja listo el método para conectar luego
  const handleSubmit = async (payload) => {
    // Aquí el ingeniero conectará el POST al backend, ejemplo:
    // await api.post("/courses/rating", payload)
    console.log("Rating payload (placeholder):", payload);
  };

  return (
    <div className="min-h-screen grid place-items-center px-4 py-10">
      <CourseRating courseId={courseId} onSubmit={handleSubmit} />
    </div>
  );
}