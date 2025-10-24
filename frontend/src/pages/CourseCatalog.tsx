import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { courseAPI, categoryAPI } from '../services/api';
import { Skeleton } from '../components/ui';
import { Link } from 'react-router-dom';
import { Search, Star, Clock, Users, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CourseCatalog = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses', search, category, level],
    queryFn: () => courseAPI.getAll({ search, category, level }).then((res: any) => res.data),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryAPI.getAll().then((res: any) => res.data),
  });

  const levelTranslations: Record<string, string> = {
    'BEGINNER': 'Cơ bản',
    'INTERMEDIATE': 'Trung cấp',
    'ADVANCED': 'Nâng cao'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Khám phá khóa học
          </h1>
          <p className="text-xl text-gray-600">Hơn 1,000 khóa học chất lượng cao từ các chuyên gia</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-xl border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-lg"
            />
          </div>
        </motion.div>

        {/* Filters - Glassmorphism Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-gray-200/50 p-6 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Danh mục</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-xl border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                >
                  <option value="">Tất cả danh mục</option>
                  {categories?.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cấp độ</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-xl border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                >
                  <option value="">Tất cả cấp độ</option>
                  <option value="BEGINNER">Cơ bản</option>
                  <option value="INTERMEDIATE">Trung cấp</option>
                  <option value="ADVANCED">Nâng cao</option>
                </select>
              </div>

              <div className="flex items-end">
                {(search || category || level) && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => {
                      setSearch('');
                      setCategory('');
                      setLevel('');
                    }}
                    className="w-full px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Xóa bộ lọc
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-lg">
                <Skeleton className="h-56 mb-0" />
                <div className="p-6">
                  <Skeleton className="h-6 mb-3" />
                  <Skeleton className="h-4 mb-2" />
                  <Skeleton className="h-4 mb-4" />
                  <Skeleton className="h-8" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {courses?.courses?.map((course: any) => (
                <motion.div
                  key={course.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="group"
                >
                  <Link to={`/courses/${course.slug}`}>
                    <div className="bg-white rounded-3xl overflow-hidden border-2 border-gray-200 hover:border-purple-300 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 h-full">
                      {/* Image */}
                      <div className="relative h-56 overflow-hidden">
                        <motion.img
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.4 }}
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                        
                        {/* Price Badge */}
                        <div className="absolute top-4 right-4 px-4 py-2 bg-white/95 backdrop-blur-xl rounded-full shadow-lg">
                          <span className="font-bold text-purple-600 text-lg">
                            {course.price.toLocaleString('vi-VN')}đ
                          </span>
                        </div>

                        {/* Rating */}
                        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/95 backdrop-blur-xl px-3 py-1.5 rounded-xl shadow-lg">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-bold text-gray-900">{course.averageRating}</span>
                          <span className="text-xs text-gray-500">({course.totalReviews || 0})</span>
                        </div>

                        {/* Students Count */}
                        <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-blue-500/90 backdrop-blur-xl px-3 py-1.5 rounded-xl shadow-lg text-white">
                          <Users className="w-4 h-4" />
                          <span className="text-sm font-semibold">{course.totalStudents || 0}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-3 py-1 bg-purple-100 rounded-lg text-xs font-semibold text-purple-700">
                            {course.category?.name}
                          </span>
                          <span className="px-3 py-1 bg-blue-100 rounded-lg text-xs font-semibold text-blue-700">
                            {levelTranslations[course.level] || course.level}
                          </span>
                        </div>

                        <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                          {course.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                          {course.description}
                        </p>

                        <div className="pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-9 h-9 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md">
                                {course.instructor?.name?.charAt(0)}
                              </div>
                              <span className="text-sm font-medium text-gray-700">{course.instructor?.name}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{course.totalDuration || '12h'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>{course.totalLessons || 0} bài học</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && courses?.courses?.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy khóa học</h3>
            <p className="text-gray-600 mb-6">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            <button
              onClick={() => {
                setSearch('');
                setCategory('');
                setLevel('');
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-semibold"
            >
              Xóa bộ lọc
            </button>
          </motion.div>
        )}

        {/* Results Count */}
        {!isLoading && courses?.courses && courses.courses.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 text-center text-gray-600"
          >
            Hiển thị <span className="font-bold text-purple-600">{courses.courses.length}</span> khóa học
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CourseCatalog;
