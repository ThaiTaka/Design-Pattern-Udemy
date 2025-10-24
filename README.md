# 🎓 E-Learning Platform (Udemy Clone)

A **production-ready**, **full-stack** E-Learning platform built with modern technologies and design patterns. Features include course management, user authentication, enrollment system, and beautiful animations.

![Tech Stack](https://img.shields.io/badge/Frontend-React%2018-blue)
![Tech Stack](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green)
![Tech Stack](https://img.shields.io/badge/Database-PostgreSQL-orange)
![Tech Stack](https://img.shields.io/badge/TypeScript-100%25-blue)

---

## ✨ Features

### 🎨 Frontend
- ⚡ **Vite** - Lightning-fast build tool
- ⚛️ **React 18** with TypeScript
- 🎭 **Framer Motion** - Smooth 60fps animations
- 🎨 **Tailwind CSS** - Modern, responsive UI
- 🔄 **React Query** - Server state management
- 🐻 **Zustand** - Lightweight client state
- 📱 **Mobile-first** responsive design

### 🔧 Backend
- 🚀 **Node.js + Express** with TypeScript
- 🗄️ **PostgreSQL** with Prisma ORM
- 💾 **Redis** caching (in-memory mock)
- 🔐 **JWT Authentication**
- 🏗️ **Design Patterns** implementation:
  - **Singleton** (Database, Logger, Cache)
  - **Factory** (User, Course creation)
  - **Decorator** (Course features)
  - **Observer** (Event system)
  - **Strategy** (Pricing, Search)
  - **Repository** (Data access)

### 🎯 Key Functionality
- 👤 User authentication (Student, Instructor, Admin roles)
- 📚 Course catalog with search & filters
- 🎥 Course details with curriculum
- ✏️ Course enrollment system
- ⭐ Course reviews & ratings
- 📊 Student dashboard with progress tracking
- 🎨 Impressive animations throughout

---

## 🏗️ Tech Stack & Architecture

### Why This Stack?

#### **Frontend**
- **React 18**: Industry-standard, component-based architecture
- **TypeScript**: Type safety, better DX, fewer runtime errors
- **Vite**: 10x faster than CRA, instant HMR
- **Framer Motion**: Professional animations, declarative API
- **Tailwind CSS**: Rapid development, consistent design, smaller bundle
- **React Query**: Automatic caching, background refetching, optimistic updates
- **Zustand**: Simpler than Redux, no boilerplate

#### **Backend**
- **Node.js + Express**: JavaScript everywhere, massive ecosystem
- **Prisma ORM**: Type-safe database access, auto-migrations
- **PostgreSQL**: ACID compliance, complex queries, scalability
- **JWT**: Stateless authentication, scalable across servers

#### **Architecture**
- **Monorepo**: Shared types, single `npm run dev` command
- **Design Patterns**: Production-ready code, maintainable, testable
- **Docker**: Consistent dev environment, easy deployment

---

## 🎨 Design Patterns Explained

### 1️⃣ **Singleton Pattern**
**Files**: `backend/src/patterns/singleton/`

**Problem**: Creating multiple database connections wastes resources and can hit connection limits.

**Solution**: Single `PrismaClient` instance shared across the application.

```typescript
// ❌ Without Singleton - Multiple connections
const prisma1 = new PrismaClient(); // Connection pool 1
const prisma2 = new PrismaClient(); // Connection pool 2 (wasteful!)

// ✅ With Singleton - One connection
const prisma = DatabaseConnection.getInstance(); // Always same instance
```

**Also Used For**:
- `Logger`: Centralized logging configuration
- `CacheManager`: Single Redis connection

---

### 2️⃣ **Factory Pattern**
**Files**: `backend/src/patterns/factory/`

**Problem**: Creating objects (Users, Courses) requires complex initialization, validation, and different configurations.

**Solution**: Factory methods encapsulate object creation logic.

```typescript
// ❌ Without Factory - Repetitive, error-prone
const user = {
  email: email.toLowerCase(),
  password: await bcrypt.hash(password, 10),
  role: 'STUDENT',
  avatar: generateAvatar(),
  // ... validation logic repeated everywhere
};

// ✅ With Factory - Clean, validated
const user = await UserFactory.createStudent({ email, password, name });
```

**Benefits**:
- Consistent validation
- Role-specific defaults
- Easy to test
- Single source of truth

---

### 3️⃣ **Decorator Pattern**
**Files**: `backend/src/patterns/decorator/`

**Problem**: Want to add features (discounts, badges) to courses without modifying original code or creating dozens of subclasses.

**Solution**: Wrap course objects with decorators that add behavior dynamically.

```typescript
// Stack multiple features without class explosion
const course = new CourseWrapper(/* ... */);
const featured = new FeaturedDecorator(course);
const discounted = new DiscountDecorator(featured, 20); // 20% off
const final = new BestsellerDecorator(discounted, 5000); // 5000 students

console.log(final.getBadges()); // ['Featured', '20% OFF', 'Bestseller']
```

**Real Use Cases**:
- Seasonal sales (temporary discount decorator)
- A/B testing (feature decorator on/off)
- Personalization (user-specific decorators)

---

### 4️⃣ **Observer Pattern**
**Files**: `backend/src/patterns/observer/`

**Problem**: When user enrolls, need to: send email, update analytics, notify instructor, update stats. Tight coupling if done directly.

**Solution**: Event-driven architecture. Components subscribe to events.

```typescript
// ❌ Tightly Coupled
async function enrollCourse(userId, courseId) {
  await createEnrollment(userId, courseId);
  await sendWelcomeEmail(userId); // What if email fails?
  await updateAnalytics(userId);  // Blocks the request
  await notifyInstructor(courseId);
}

// ✅ Loosely Coupled - Observer Pattern
await eventBus.emit('course:enrolled', { userId, courseId });
// Multiple listeners respond independently, no blocking
```

**Benefits**:
- Loose coupling
- Easy to add new features (just add listener)
- Async, non-blocking
- Each component testable in isolation

---

### 5️⃣ **Strategy Pattern**
**Files**: `backend/src/patterns/strategy/`

**Problem**: Different pricing models (regular, bulk, subscription) require different calculations. If/else chains are messy.

**Solution**: Encapsulate algorithms in strategies, swap at runtime.

```typescript
// ❌ Without Strategy - Messy if/else
function calculatePrice(basePrice, quantity, type) {
  if (type === 'regular') {
    return basePrice * quantity;
  } else if (type === 'bulk') {
    // complex bulk logic...
  } else if (type === 'subscription') {
    // subscription logic...
  }
}

// ✅ With Strategy - Clean, extensible
const context = new PricingContext(new BulkDiscountStrategy());
const total = context.calculateTotal(basePrice, quantity);
```

**Real Use Cases**:
- Payment methods (Credit Card, PayPal, Crypto)
- Sorting algorithms (by price, popularity, rating)
- Search strategies (text, category, fuzzy)

---

### 6️⃣ **Repository Pattern**
**Files**: `backend/src/patterns/repository/`

**Problem**: Database queries scattered across controllers. Hard to test, change database, or optimize queries.

**Solution**: Centralize data access in repositories.

```typescript
// ❌ Without Repository - Scattered queries
app.get('/courses', async (req, res) => {
  const courses = await prisma.course.findMany({
    where: { ... },
    include: { ... }
  });
});

// ✅ With Repository - Centralized, testable
const courseRepo = new CourseRepository();
const courses = await courseRepo.findAll({ category, level, search });
```

**Benefits**:
- Single place to optimize queries
- Easy to mock for testing
- Can switch databases without touching controllers
- Consistent error handling

---

## 📂 Project Structure

```
elearning-platform/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── animations/      # Framer Motion wrappers
│   │   │   ├── layout/          # Header, Footer
│   │   │   └── ui/              # Button, Card, Input
│   │   ├── pages/
│   │   │   ├── Home.tsx         # Landing with animations
│   │   │   ├── CourseCatalog.tsx
│   │   │   ├── CourseDetail.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── auth/
│   │   ├── services/api.ts      # Axios + API methods
│   │   ├── store/useStore.ts    # Zustand auth store
│   │   └── App.tsx
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                     # Node.js API
│   ├── src/
│   │   ├── patterns/            # 🎯 DESIGN PATTERNS
│   │   │   ├── singleton/       # Database, Logger, Cache
│   │   │   ├── factory/         # User, Course factories
│   │   │   ├── decorator/       # Course decorators
│   │   │   ├── observer/        # Event bus
│   │   │   ├── strategy/        # Pricing, Search
│   │   │   └── repository/      # Data access layer
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── index.ts
│   ├── prisma/
│   │   ├── schema.prisma        # Database models
│   │   └── seed.ts              # 20 courses, 100 lessons
│   └── package.json
│
├── scripts/
│   └── wait-for-db.js           # Database healthcheck
│
├── docker-compose.yml           # PostgreSQL + Redis + Adminer
├── package.json                 # Root workspace
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Docker Desktop** (for database)
- **Node.js 20+** and **npm 10+**

### Installation

```bash
# 1. Clone repository
git clone <repo-url>
cd elearning-platform

# 2. Install all dependencies (frontend + backend)
npm run install:all

# 3. Copy environment file
cp backend/.env.example backend/.env

# 4. Start everything with ONE command! 🎉
npm run dev
```

**That's it!** The script will:
1. ✅ Start Docker containers (PostgreSQL + Redis + Adminer)
2. ✅ Wait for database to be ready
3. ✅ Generate Prisma client
4. ✅ Run database migrations
5. ✅ Seed realistic data
6. ✅ Start backend server (http://localhost:5000)
7. ✅ Start frontend dev server
8. ✅ **Automatically open browser** at http://localhost:3000

---

## 🔐 Test Accounts

| Role       | Email                  | Password     |
|------------|------------------------|--------------|
| Student    | student@test.com       | password123  |
| Instructor | instructor@test.com    | password123  |
| Admin      | admin@test.com         | password123  |

---

## 🎨 Animation Showcase

### 🏠 Home Page
- **Hero Section**: Animated gradient background, text reveal animation
- **Floating Cards**: Cards float with CSS animation
- **Stats Counter**: Numbers animate from 0 to target value
- **Stagger Animation**: Course cards appear sequentially

### 📚 Course Catalog
- **Search Bar**: Width expands on focus
- **Course Cards**: Scale 1.05 + shadow on hover (Framer Motion)
- **Skeleton Loading**: Shimmer effect while loading

### 📖 Course Detail
- **Curriculum Accordion**: Smooth height animation
- **Enroll Button**: Continuous pulse animation
- **Reviews**: Slide in from top

### 📊 Dashboard
- **Progress Bars**: Animated stroke-dashoffset
- **Activity Feed**: Items slide in sequentially
- **Stats Cards**: Pop-in with scale

### 🔐 Auth Pages
- **Input Focus**: Glowing border animation
- **Error Messages**: Shake animation
- **Success**: Checkmark with scale + fade

---

## 📡 API Endpoints

### Authentication
```bash
POST /api/auth/register    # Register new user
POST /api/auth/login       # Login user
GET  /api/auth/me          # Get current user profile
```

### Courses
```bash
GET  /api/courses          # Get all courses (with filters)
GET  /api/courses/featured # Get featured courses
GET  /api/courses/:slug    # Get course by slug
POST /api/courses/:id/enroll       # Enroll in course (auth required)
POST /api/courses/:id/reviews      # Create review (auth required)
```

### Categories
```bash
GET  /api/categories       # Get all categories
```

---

## 🗄️ Database Schema

### Models
- **User**: Student, Instructor, Admin roles
- **Category**: Programming, Design, Business, etc.
- **Course**: Title, price, level, thumbnail
- **Lesson**: Video URL, duration, order
- **Enrollment**: User ↔ Course (progress tracking)
- **Review**: Rating (1-5), comment
- **LessonProgress**: Track which lessons completed

### Seed Data
- ✅ 5 categories
- ✅ 20 courses (realistic descriptions, thumbnails)
- ✅ 100 lessons (5 per course, first lesson free)
- ✅ 3 users (student, instructor, admin)
- ✅ 15 reviews (4-5 star ratings)
- ✅ 10 enrollments (varying progress)

---

## 🛠️ Development Scripts

```bash
# Start everything
npm run dev

# Docker
npm run docker:up         # Start containers
npm run docker:down       # Stop containers
npm run docker:clean      # Remove volumes

# Backend only
npm run dev:backend       # Start backend server

# Frontend only
npm run dev:frontend      # Start frontend dev server

# Database
npm run prisma:studio     # Open Prisma Studio (GUI)

# Install dependencies
npm run install:all       # Install root + workspaces
```

---

## 🎯 Key Design Decisions

### Why Monorepo?
- **Shared Types**: Frontend and backend share TypeScript interfaces
- **Single Command**: `npm run dev` starts everything
- **Coordinated Changes**: Change API and frontend together
- **Simplified CI/CD**: One repository to deploy

### Why Docker for Database Only?
- **Easy Setup**: `docker-compose up` - database ready
- **Consistency**: Same environment for all developers
- **Local Development**: Frontend/backend with hot reload (faster)
- **Production Flexibility**: Can deploy frontend/backend separately

### Why These Design Patterns?
- **Production-Ready**: Used by Fortune 500 companies
- **Maintainable**: Easy to understand, modify, extend
- **Testable**: Each pattern is independently testable
- **Educational**: Learn industry best practices

---

## 🐛 Troubleshooting

### Database Connection Failed
```bash
# Check Docker is running
docker ps

# Restart containers
npm run docker:down
npm run docker:up

# Check database logs
docker logs elearning-postgres
```

### Port Already in Use
```bash
# Frontend (3000)
# Kill process on port 3000
npx kill-port 3000

# Backend (5000)
npx kill-port 5000
```

### Prisma Client Not Generated
```bash
cd backend
npm run prisma:generate
```

### TypeScript Errors After Installing
```bash
# Restart TypeScript server in VS Code
# Command Palette (Ctrl+Shift+P) → "TypeScript: Restart TS Server"

# Or reinstall dependencies
rm -rf node_modules frontend/node_modules backend/node_modules
npm run install:all
```

### Database Out of Sync
```bash
cd backend
npx prisma migrate reset  # ⚠️ Deletes all data
npm run prisma:seed       # Re-seed data
```

---

## 📈 Performance Optimizations

### Frontend
- ✅ Code splitting (React.lazy)
- ✅ Image optimization (WebP, lazy loading)
- ✅ React Query caching (5min TTL)
- ✅ Debounced search input
- ✅ Virtualized lists for large datasets

### Backend
- ✅ Database indexing on frequently queried fields
- ✅ Redis caching (course listings, categories)
- ✅ Query optimization (select only needed fields)
- ✅ Connection pooling (Prisma)
- ✅ Compression middleware

---

## 🚢 Deployment Guide

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy 'dist' folder
```

### Backend (Railway/Render/Heroku)
```bash
cd backend
npm run build
# Set DATABASE_URL env variable
# Run: node dist/index.js
```

### Database (Supabase/Neon/Railway)
- Use managed PostgreSQL service
- Update `DATABASE_URL` in production
- Run migrations: `npx prisma migrate deploy`

---

## 🤝 Contributing

This is a learning project demonstrating best practices. Feel free to:
- Report bugs
- Suggest improvements
- Submit pull requests

---

## 📝 License

MIT License - feel free to use this project for learning!

---

## 🎓 Learning Resources

- [React Query Docs](https://tanstack.com/query/latest)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Design Patterns (Refactoring Guru)](https://refactoring.guru/design-patterns)

---

## ⭐ Features Showcase

| Feature | Technology | Status |
|---------|-----------|--------|
| Authentication | JWT + Bcrypt | ✅ |
| Course Catalog | React Query + Prisma | ✅ |
| Smooth Animations | Framer Motion | ✅ |
| Design Patterns | 6 Patterns Implemented | ✅ |
| Database Seed | 20 Courses + 100 Lessons | ✅ |
| Responsive Design | Tailwind CSS | ✅ |
| TypeScript | 100% Type Safe | ✅ |
| Docker Setup | One Command | ✅ |

---

## 💡 What You'll Learn

1. **Full-Stack Development**: Build complete applications
2. **Design Patterns**: Industry-standard architecture
3. **TypeScript**: Advanced type safety
4. **Modern React**: Hooks, Context, Custom hooks
5. **Animation**: Framer Motion mastery
6. **Database Design**: Prisma ORM + PostgreSQL
7. **API Design**: RESTful best practices
8. **Authentication**: JWT implementation
9. **State Management**: Zustand + React Query
10. **DevOps**: Docker, environment setup

---

**Built with ❤️ for learning and growth**

Happy Coding! 🚀
