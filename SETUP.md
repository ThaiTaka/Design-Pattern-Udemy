# Hướng dẫn chạy dự án E-Learning Platform

## Yêu cầu hệ thống

1. **Node.js** (phiên bản 18+)
2. **Docker Desktop** (để chạy PostgreSQL và Redis)
3. **npm** (đi kèm với Node.js)

## Cài đặt và chạy dự án

### Bước 1: Khởi động Docker Desktop
- Mở Docker Desktop trên Windows
- Đợi cho đến khi Docker khởi động hoàn tất (icon Docker tray màu xanh)

### Bước 2: Chạy toàn bộ dự án với một lệnh
```bash
npm run dev
```

Lệnh này sẽ:
1. Dọn dẹp các process cũ (port 3000, 5000, 5555)
2. Khởi động Docker containers (PostgreSQL, Redis, Adminer)
3. Đợi database khởi động
4. Tạo database schema và seed data
5. Chạy backend (port 5000) và frontend (port 3000) đồng thời

### Bước 3: Truy cập ứng dụng

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database Admin (Adminer)**: http://localhost:8080
  - Server: `postgres`
  - Username: `elearning`
  - Password: `elearning123`
  - Database: `elearning`

## Các lệnh hữu ích khác

```bash
# Chỉ khởi động database
npm run docker:up

# Dừng database
npm run docker:down

# Xóa database và volumes
npm run docker:clean

# Mở Prisma Studio (GUI database)
npm run prisma:studio

# Cài đặt tất cả dependencies
npm run install:all

# Dọn dẹp project
npm run clean
```

## Xử lý sự cố

### Lỗi Docker
- Đảm bảo Docker Desktop đang chạy
- Thử `npm run docker:clean` rồi `npm run dev` lại

### Lỗi Port đã được sử dụng
- Script tự động dọn dẹp ports, nhưng nếu vẫn lỗi:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /F /PID <PID>
```

### Lỗi Database
```bash
npm run docker:clean
npm run dev
```

## Cấu trúc dự án

```
udemy/
├── package.json           # Root package với script chính
├── REPORT.md             # Báo cáo chi tiết về patterns
├── Executable/           # Scripts và Docker config
│   ├── docker-compose.yml
│   ├── package.json
│   └── scripts/
├── Source/
│   ├── frontend/         # React + Vite + TypeScript
│   └── backend/          # Node.js + Express + Prisma
└── Database/             # Schema và migrations
```

## Design Patterns được sử dụng

1. **Singleton**: DatabaseConnection, CacheManager, Logger
2. **Factory**: CourseFactory, UserFactory  
3. **Repository**: CourseRepository, UserRepository
4. **Strategy**: PricingStrategy, SearchStrategy
5. **Observer**: EventBus cho events
6. **Decorator**: CourseDecorator cho features

Xem chi tiết trong `REPORT.md`.