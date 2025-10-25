import { PrismaClient, CourseLevel, Language } from '@prisma/client';
import { UserFactory } from '../src/patterns/factory/UserFactory';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.lessonProgress.deleteMany();
  await prisma.review.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Users
  console.log('👥 Creating users...');
  const studentData = await UserFactory.createStudent({
    email: 'student@test.com',
    password: 'password123',
    name: 'John Student',
  });

  const instructorData = await UserFactory.createInstructor({
    email: 'instructor@test.com',
    password: 'password123',
    name: 'Sarah Teacher',
    bio: 'Passionate educator with 10+ years of experience in web development and software engineering. Dedicated to helping students achieve their learning goals.',
  });

  const adminData = await UserFactory.createAdmin({
    email: 'admin@test.com',
    password: 'password123',
    name: 'Admin User',
  });

  const student = await prisma.user.create({ data: studentData });
  const instructor = await prisma.user.create({ data: instructorData });
  await prisma.user.create({ data: adminData });

  console.log(`✅ Created 3 users`);

  // 2. Create Categories
  console.log('\n📁 Creating categories...');
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Programming',
        slug: 'programming',
        icon: 'Code2',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Design',
        slug: 'design',
        icon: 'Palette',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Business',
        slug: 'business',
        icon: 'Briefcase',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Marketing',
        slug: 'marketing',
        icon: 'TrendingUp',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Personal Development',
        slug: 'personal-development',
        icon: 'Lightbulb',
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // 3. Create Courses
  console.log('\n📚 Creating courses...');
  const coursesData = [
    {
      title: 'Complete React Developer Masterclass',
      description: 'Master React from fundamentals to advanced concepts. Build modern, scalable web applications with React 18, Hooks, Redux, and TypeScript. Includes 12 real-world projects.',
      price: 89.99,
      discount: 15,
      level: CourseLevel.INTERMEDIATE,
      language: Language.ENGLISH,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      categoryId: categories[0].id,
      isFeatured: true,
    },
    {
      title: 'Node.js: The Complete Guide',
      description: 'Learn Node.js, Express, MongoDB, and build full-stack applications. Master REST APIs, authentication, file uploads, and deployment. Perfect for backend development.',
      price: 79.99,
      discount: 20,
      level: CourseLevel.INTERMEDIATE,
      language: Language.ENGLISH,
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
      categoryId: categories[0].id,
      isFeatured: true,
    },
    {
      title: 'Python for Data Science and Machine Learning',
      description: 'Complete Python data science bootcamp covering NumPy, Pandas, Matplotlib, Seaborn, Scikit-Learn, TensorFlow, and real-world projects.',
      price: 99.99,
      discount: 25,
      level: CourseLevel.ADVANCED,
      language: Language.ENGLISH,
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800',
      categoryId: categories[0].id,
      isFeatured: true,
    },
    {
      title: 'UI/UX Design Fundamentals',
      description: 'Learn user interface and user experience design from scratch. Master Figma, design systems, prototyping, and create stunning digital products.',
      price: 69.99,
      discount: 0,
      level: CourseLevel.BEGINNER,
      language: Language.ENGLISH,
      thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800',
      categoryId: categories[1].id,
    },
    {
      title: 'Digital Marketing Masterclass 2024',
      description: 'Complete digital marketing course covering SEO, social media marketing, email marketing, content marketing, and analytics. Grow your business online.',
      price: 59.99,
      discount: 10,
      level: CourseLevel.ALL_LEVELS,
      language: Language.ENGLISH,
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      categoryId: categories[3].id,
      isFeatured: true,
    },
    {
      title: 'Full-Stack Web Development Bootcamp',
      description: 'Become a full-stack developer. Learn HTML, CSS, JavaScript, React, Node.js, MongoDB, and build 15 real-world projects from scratch.',
      price: 129.99,
      discount: 30,
      level: CourseLevel.BEGINNER,
      language: Language.ENGLISH,
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
      categoryId: categories[0].id,
      isFeatured: true,
    },
    {
      title: 'Advanced TypeScript Development',
      description: 'Master TypeScript advanced features, generics, decorators, and design patterns. Build type-safe, scalable applications.',
      price: 74.99,
      discount: 0,
      level: CourseLevel.ADVANCED,
      language: Language.ENGLISH,
      thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
      categoryId: categories[0].id,
    },
    {
      title: 'Graphic Design Masterclass',
      description: 'Learn Adobe Photoshop, Illustrator, and InDesign. Create logos, branding, posters, and marketing materials. Build a professional portfolio.',
      price: 84.99,
      discount: 15,
      level: CourseLevel.INTERMEDIATE,
      language: Language.ENGLISH,
      thumbnail: 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=800',
      categoryId: categories[1].id,
    },
    {
      title: 'Business Strategy and Leadership',
      description: 'Develop strategic thinking, leadership skills, and business acumen. Learn from real case studies and build executive presence.',
      price: 94.99,
      discount: 0,
      level: CourseLevel.INTERMEDIATE,
      language: Language.ENGLISH,
      thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
      categoryId: categories[2].id,
    },
    {
      title: 'Public Speaking Mastery',
      description: 'Overcome fear of public speaking. Learn presentation skills, storytelling, body language, and deliver impactful speeches with confidence.',
      price: 49.99,
      discount: 0,
      level: CourseLevel.ALL_LEVELS,
      language: Language.ENGLISH,
      thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
      categoryId: categories[4].id,
    },
    {
      title: 'AWS Cloud Practitioner Certification',
      description: 'Prepare for AWS certification. Master cloud computing, EC2, S3, Lambda, RDS, and deploy scalable applications on AWS.',
      price: 79.99,
      discount: 20,
      level: CourseLevel.INTERMEDIATE,
      language: Language.ENGLISH,
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
      categoryId: categories[0].id,
      isFeatured: true,
    },
    {
      title: 'Mobile App Development with React Native',
      description: 'Build iOS and Android apps with one codebase. Learn React Native, navigation, state management, and publish apps to stores.',
      price: 89.99,
      discount: 0,
      level: CourseLevel.INTERMEDIATE,
      language: Language.ENGLISH,
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
      categoryId: categories[0].id,
    },
    {
      title: 'Motion Graphics with After Effects',
      description: 'Create stunning animations and motion graphics. Master Adobe After Effects, kinetic typography, and visual effects.',
      price: 69.99,
      discount: 10,
      level: CourseLevel.INTERMEDIATE,
      language: Language.ENGLISH,
      thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800',
      categoryId: categories[1].id,
    },
    {
      title: 'Financial Analysis and Modeling',
      description: 'Learn financial modeling, valuation, Excel skills, and make data-driven business decisions. Master DCF, LBO, and M&A analysis.',
      price: 99.99,
      discount: 0,
      level: CourseLevel.ADVANCED,
      language: Language.ENGLISH,
      thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
      categoryId: categories[2].id,
    },
    {
      title: 'Social Media Marketing Strategy',
      description: 'Master Instagram, Facebook, Twitter, LinkedIn marketing. Create viral content, run ads, and grow your social media presence.',
      price: 54.99,
      discount: 15,
      level: CourseLevel.BEGINNER,
      language: Language.ENGLISH,
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
      categoryId: categories[3].id,
    },
    {
      title: 'Productivity and Time Management',
      description: 'Boost productivity, manage time effectively, eliminate distractions, and achieve your goals. Learn proven systems and techniques.',
      price: 39.99,
      discount: 0,
      level: CourseLevel.ALL_LEVELS,
      language: Language.ENGLISH,
      thumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800',
      categoryId: categories[4].id,
    },
    {
      title: 'Docker and Kubernetes Complete Guide',
      description: 'Master containerization with Docker and orchestration with Kubernetes. Deploy microservices, CI/CD pipelines, and production systems.',
      price: 84.99,
      discount: 20,
      level: CourseLevel.ADVANCED,
      language: Language.ENGLISH,
      thumbnail: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800',
      categoryId: categories[0].id,
    },
    {
      title: 'Brand Identity Design',
      description: 'Create memorable brand identities. Learn logo design, color theory, typography, and brand guidelines for clients.',
      price: 74.99,
      discount: 0,
      level: CourseLevel.INTERMEDIATE,
      language: Language.ENGLISH,
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
      categoryId: categories[1].id,
    },
    {
      title: 'Project Management Professional (PMP)',
      description: 'Prepare for PMP certification. Master project management methodologies, Agile, Scrum, risk management, and stakeholder communication.',
      price: 109.99,
      discount: 25,
      level: CourseLevel.INTERMEDIATE,
      language: Language.ENGLISH,
      thumbnail: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=800',
      categoryId: categories[2].id,
    },
    {
      title: 'Mindfulness and Meditation Mastery',
      description: 'Reduce stress, improve focus, and enhance wellbeing through mindfulness practices. Daily guided meditations included.',
      price: 44.99,
      discount: 0,
      level: CourseLevel.BEGINNER,
      language: Language.ENGLISH,
      thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
      categoryId: categories[4].id,
    },
  ];

  const courses = [];
  for (const courseData of coursesData) {
    const slug = courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    const course = await prisma.course.create({
      data: {
        ...courseData,
        slug,
        instructorId: instructor.id,
        duration: 0, // Will be updated when lessons are added
      },
    });
    courses.push(course);
    await new Promise(resolve => setTimeout(resolve, 10)); // Small delay for unique slugs
  }

  console.log(`✅ Created ${courses.length} courses`);

  // 4. Create Lessons (5 per course)
  console.log('\n📝 Creating lessons...');
  let totalLessons = 0;
  for (const course of courses) {
    const lessonTitles = [
      'Introduction and Course Overview',
      'Getting Started - Setup and Installation',
      'Core Concepts and Fundamentals',
      'Advanced Techniques and Best Practices',
      'Final Project and Conclusion',
    ];

    let totalDuration = 0;
    for (let i = 0; i < 5; i++) {
      const duration = Math.floor(Math.random() * 600) + 300; // 5-15 minutes
      totalDuration += duration;
      await prisma.lesson.create({
        data: {
          title: lessonTitles[i],
          description: `In this lesson, you'll learn about ${lessonTitles[i].toLowerCase()}. Includes practical examples and exercises.`,
          videoUrl: `https://example.com/videos/${course.slug}-lesson-${i + 1}.mp4`,
          duration,
          order: i + 1,
          isFree: i === 0, // First lesson is free
          courseId: course.id,
        },
      });
      totalLessons++;
    }

    // Update course duration
    await prisma.course.update({
      where: { id: course.id },
      data: { duration: Math.floor(totalDuration / 60) }, // Convert to minutes
    });
  }

  console.log(`✅ Created ${totalLessons} lessons`);

  // 5. Create Enrollments
  console.log('\n🎓 Creating enrollments...');
  const enrollmentData = [
    { courseIndex: 0, progress: 100 },
    { courseIndex: 1, progress: 75 },
    { courseIndex: 2, progress: 50 },
    { courseIndex: 3, progress: 30 },
    { courseIndex: 4, progress: 10 },
    { courseIndex: 5, progress: 60 },
    { courseIndex: 6, progress: 0 },
    { courseIndex: 10, progress: 40 },
    { courseIndex: 14, progress: 80 },
    { courseIndex: 16, progress: 20 },
  ];

  for (const { courseIndex, progress } of enrollmentData) {
    await prisma.enrollment.create({
      data: {
        userId: student.id,
        courseId: courses[courseIndex].id,
        progress,
        completedAt: progress === 100 ? new Date() : null,
      },
    });
  }

  console.log(`✅ Created ${enrollmentData.length} enrollments`);

  // 6. Create Reviews - alternating users to avoid unique constraint
  console.log('\n⭐ Creating reviews...');
  
  // Get all users for variety
  const allUsers = await prisma.user.findMany();
  
  const reviews = [
    { courseIndex: 0, rating: 5, comment: 'Absolutely amazing course! The instructor explains everything clearly and the projects are really practical. Highly recommend!', userIndex: 0 },
    { courseIndex: 1, rating: 5, comment: 'Excellent course for learning Node.js. Great examples and real-world projects. The instructor is very knowledgeable.', userIndex: 0 },
    { courseIndex: 2, rating: 4, comment: 'Very comprehensive Python course. Could use more exercises but overall great content and well-structured.', userIndex: 0 },
    { courseIndex: 3, rating: 5, comment: 'Perfect for beginners in UI/UX. Learned so much about design principles and Figma. Thank you!', userIndex: 0 },
    { courseIndex: 4, rating: 4, comment: 'Good overview of digital marketing. Covers all the essential topics. Would love more case studies.', userIndex: 0 },
    { courseIndex: 5, rating: 5, comment: 'This bootcamp changed my career! Got a job as a developer 3 months after completing. Thank you so much!', userIndex: 1 },
    { courseIndex: 6, rating: 5, comment: 'Advanced TypeScript concepts explained brilliantly. Finally understand generics and decorators!', userIndex: 1 },
    { courseIndex: 10, rating: 5, comment: 'Passed my AWS certification on first try! This course prepared me perfectly. Highly recommended!', userIndex: 1 },
    { courseIndex: 14, rating: 4, comment: 'Great social media marketing strategies. Already seeing results in my business!', userIndex: 1 },
    { courseIndex: 7, rating: 5, comment: 'Solid Node.js fundamentals. The project-based approach really helps with learning.', userIndex: 1 },
    { courseIndex: 8, rating: 5, comment: 'Best investment in my education. The skills I learned here are directly applicable to my job.', userIndex: 2 },
    { courseIndex: 9, rating: 5, comment: 'Incredible depth on machine learning topics. The TensorFlow section was especially helpful.', userIndex: 2 },
    { courseIndex: 16, rating: 5, comment: 'Docker and Kubernetes made simple. Love the hands-on labs and clear explanations.', userIndex: 2 },
    { courseIndex: 11, rating: 3, comment: 'Good course but feels a bit rushed in some sections. Still learned a lot about digital marketing.', userIndex: 2 },
    { courseIndex: 12, rating: 4, comment: 'Great course for understanding business fundamentals!', userIndex: 2 },
  ];

  for (const { courseIndex, rating, comment, userIndex } of reviews) {
    await prisma.review.create({
      data: {
        userId: allUsers[userIndex].id,
        courseId: courses[courseIndex].id,
        rating,
        comment,
      },
    });
  }

  console.log(`✅ Created ${reviews.length} reviews`);

  console.log('\n✨ Database seeded successfully!\n');
  console.log('📊 Summary:');
  console.log(`   - Users: 3`);
  console.log(`   - Categories: ${categories.length}`);
  console.log(`   - Courses: ${courses.length}`);
  console.log(`   - Lessons: ${totalLessons}`);
  console.log(`   - Enrollments: ${enrollmentData.length}`);
  console.log(`   - Reviews: ${reviews.length}`);
  console.log('\n🔐 Test Accounts:');
  console.log('   Student: student@test.com / password123');
  console.log('   Instructor: instructor@test.com / password123');
  console.log('   Admin: admin@test.com / password123\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
