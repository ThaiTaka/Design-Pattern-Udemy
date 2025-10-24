import { useQuery } from '@tanstack/react-query';
import { authAPI } from '../services/api';
import { BookOpen, Clock, Award, TrendingUp, Flame, Star, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authAPI.getProfile().then(res => res.data),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 font-bold text-xl mb-2">Lỗi tải dữ liệu</h2>
          <p className="text-red-600">{(error as Error).message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }

  console.log('Dashboard Profile Data:', profile);

  const enrollments = profile?.user?.enrollments || [];
  const completedCourses = enrollments.filter((e: any) => e.progress === 100).length;
  const avgProgress = enrollments.length > 0 
    ? Math.round(enrollments.reduce((acc: number, e: any) => acc + (e.progress || 0), 0) / enrollments.length)
    : 0;

  const stats = [
    { 
      icon: BookOpen, 
      label: 'Khóa học', 
      value: enrollments.length.toString(), 
      gradient: 'from-blue-500 to-cyan-500',
      bg: 'from-blue-500/10 to-cyan-500/10',
      iconColor: 'text-blue-600'
    },
    { 
      icon: Clock, 
      label: 'Giờ học', 
      value: '45h', 
      gradient: 'from-green-500 to-emerald-500',
      bg: 'from-green-500/10 to-emerald-500/10',
      iconColor: 'text-green-600'
    },
    { 
      icon: Award, 
      label: 'Hoàn thành', 
      value: completedCourses.toString(), 
      gradient: 'from-yellow-500 to-orange-500',
      bg: 'from-yellow-500/10 to-orange-500/10',
      iconColor: 'text-yellow-600'
    },
    { 
      icon: TrendingUp, 
      label: 'Tiến độ TB', 
      value: `${avgProgress}%`, 
      gradient: 'from-purple-500 to-pink-500',
      bg: 'from-purple-500/10 to-pink-500/10',
      iconColor: 'text-purple-600'
    },
  ];

  const achievements = [
    { icon: '🎯', title: 'First Course', desc: 'Hoàn thành khóa học đầu tiên', unlocked: completedCourses > 0 },
    { icon: '🔥', title: 'On Fire', desc: 'Học liên tục 7 ngày', unlocked: false },
    { icon: '🏆', title: 'Top Student', desc: 'Đạt 90% tiến độ', unlocked: avgProgress >= 90 },
    { icon: '⭐', title: 'Five Star', desc: 'Nhận 5 đánh giá 5 sao', unlocked: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Dashboard của tôi
          </h1>
          <p className="text-xl text-gray-600">Xin chào, {profile?.user?.name || 'Học viên'} 👋</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group"
            >
              <div className={`relative bg-gradient-to-br ${stat.bg} backdrop-blur-xl rounded-3xl p-6 border-2 border-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden`}>
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                
                <div className="relative">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <motion.h3
                    className="text-4xl font-bold text-gray-900 mb-1"
                    initial={{ scale: 1 }}
                    whileInView={{ scale: [1, 1.1, 1] }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                  >
                    {stat.value}
                  </motion.h3>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Courses - Left 2/3 */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Khóa học của tôi</h2>
              
              <div className="space-y-4">
                {enrollments.map((enrollment: any, index: number) => (
                  <motion.div
                    key={enrollment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <Link to={`/courses/${enrollment.course.slug}`}>
                      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-gray-200 hover:border-purple-300 transition-all shadow-lg hover:shadow-2xl hover:shadow-purple-500/10">
                        <div className="flex items-center gap-6">
                          {/* Thumbnail */}
                          <div className="relative w-32 h-20 rounded-xl overflow-hidden flex-shrink-0">
                            <img 
                              src={enrollment.course.thumbnail} 
                              alt={enrollment.course.title} 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            <div className="absolute bottom-1 left-1 right-1 flex items-center justify-center">
                              <Play className="w-6 h-6 text-white" />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg mb-2 text-gray-900 hover:text-purple-600 transition-colors truncate">
                              {enrollment.course.title}
                            </h3>
                            
                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                              <motion.div
                                className={`h-2.5 rounded-full ${
                                  enrollment.progress === 100 
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                                    : 'bg-gradient-to-r from-blue-500 to-purple-500'
                                }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${enrollment.progress}%` }}
                                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                              />
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span className="font-semibold">
                                {enrollment.progress}% Hoàn thành
                              </span>
                              <span>{enrollment.course.lessons?.length || 0} bài học</span>
                            </div>
                          </div>

                          {/* Instructor */}
                          <div className="hidden md:block text-right">
                            <div className="flex items-center gap-2 justify-end mb-1">
                              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-sm font-bold text-white">
                                {enrollment.course.instructor?.name?.charAt(0)}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{enrollment.course.instructor?.name}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}

                {enrollments.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 bg-white/60 backdrop-blur-xl rounded-3xl border-2 border-dashed border-gray-300"
                  >
                    <div className="text-6xl mb-4">📚</div>
                    <p className="text-gray-600 mb-4 text-lg">Bạn chưa đăng ký khóa học nào</p>
                    <Link to="/courses">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-xl hover:shadow-purple-500/30 transition-all font-semibold"
                      >
                        Khám phá khóa học
                      </motion.button>
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Achievements - Right 1/3 */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Thành tựu</h2>
              
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-300 shadow-lg'
                        : 'bg-gray-100/50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`text-4xl ${achievement.unlocked ? 'scale-110' : 'grayscale'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{achievement.title}</h3>
                        <p className="text-sm text-gray-600">{achievement.desc}</p>
                      </div>
                      {achievement.unlocked && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                        >
                          <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Learning Streak */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-6 p-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl text-white shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Flame className="w-8 h-8" />
                  <div>
                    <h3 className="font-bold text-2xl">5 ngày</h3>
                    <p className="text-purple-100 text-sm">Chuỗi học tập</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-2 rounded-full ${
                        i < 5 ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-purple-100 mt-3">Học thêm 2 ngày để đạt mục tiêu tuần!</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
