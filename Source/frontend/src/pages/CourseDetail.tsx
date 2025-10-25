import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { courseAPI } from '../services/api';
import { Button } from '../components/ui';
import { FadeIn } from '../components/animations/AnimationWrappers';
import { Clock, BarChart, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useStore';

const CourseDetail = () => {
  const { slug } = useParams();
  const { isAuthenticated } = useAuthStore();

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', slug],
    queryFn: () => courseAPI.getBySlug(slug!).then(res => res.data),
  });

  const enrollMutation = useMutation({
    mutationFn: (id: string) => courseAPI.enroll(id),
    onSuccess: () => alert('Enrolled successfully!'),
  });

  if (isLoading) return <div className="container mx-auto px-4 py-12">Loading...</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
            <p className="text-xl mb-6">{course.description}</p>
            <div className="flex items-center gap-6 text-sm">
              <span className="flex items-center"><Clock size={16} className="mr-2" /> {course.duration} min</span>
              <span className="flex items-center"><BarChart size={16} className="mr-2" /> {course.level}</span>
              <span className="flex items-center"><Globe size={16} className="mr-2" /> {course.language}</span>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Course Curriculum</h2>
            <div className="space-y-2">
              {course.lessons?.map((lesson: any, index: number) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-semibold">{lesson.title}</h3>
                    <p className="text-sm text-gray-500">{Math.floor(lesson.duration / 60)} min</p>
                  </div>
                  {lesson.isFree && <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">Free</span>}
                </motion.div>
              ))}
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Reviews</h2>
            <div className="space-y-4">
              {course.reviews?.map((review: any) => (
                <div key={review.id} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center mb-2">
                    <img src={review.user.avatar} alt={review.user.name} className="w-10 h-10 rounded-full mr-3" />
                    <div>
                      <h4 className="font-semibold">{review.user.name}</h4>
                      <div className="text-yellow-500">{'⭐'.repeat(review.rating)}</div>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6 sticky top-24"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <img src={course.thumbnail} alt={course.title} className="w-full rounded-lg mb-4" />
              <div className="text-3xl font-bold text-blue-600 mb-4">${course.price}</div>
              {isAuthenticated() ? (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => enrollMutation.mutate(course.id)}
                    className="w-full animate-pulse-slow"
                    size="lg"
                  >
                    Enroll Now
                  </Button>
                </motion.div>
              ) : (
                <a href="/register">
                  <Button className="w-full" size="lg">Sign Up to Enroll</Button>
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
