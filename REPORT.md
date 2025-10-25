## Báo cáo — Phân tích Project và Design Patterns

Ngày: 24/10/2025

### 1. Giới thiệu

Báo cáo này tóm tắt cấu trúc, các công nghệ chính và những mẫu thiết kế (design patterns) đã áp dụng trong project "Design-Pattern-Udemy". Mục tiêu: giải thích tại sao từng pattern được dùng, mô tả chi tiết vị trí cài đặt trong codebase, và nêu ưu/nhược điểm so với các lựa chọn thay thế.

### 2. Tổng quan project

Project là một nền tảng E-Learning gồm 2 phần chính:
- Backend: API bằng TypeScript + Node.js (Express) với Prisma ORM kết nối PostgreSQL.
- Frontend: SPA React + Vite + TypeScript.

Bạn có thể xem các file cấu hình chính:
- Backend `Source/backend/package.json` — dependencies (Express, Prisma, bcrypt, jsonwebtoken...)
- Frontend `Source/frontend/package.json` — React, Vite, Zustand, TanStack Query, Tailwind
- Docker services `Executable/docker-compose.yml` — Postgres, Redis, Adminer

### 3. Công nghệ chính (chi tiết)

- Node.js + TypeScript: code backend (`Source/backend/src`) viết bằng TypeScript để có type-safety.
- Express: framework HTTP cho routing và middleware.
- Prisma: ORM tương tác với PostgreSQL, schema ở `Source/backend/prisma/schema.prisma`.
- PostgreSQL: hệ quản trị cơ sở dữ liệu quan hệ (container trong `docker-compose`).
- Redis (dự kiến): cache/session store (cài đặt mock `CacheManager` hiện dùng Map cho dev).
- Vite + React: frontend hiện đại, nhanh; `@tanstack/react-query` + `zustand` dùng cho state & data fetching.
- Công cụ bảo mật/ops: dotenv, helmet, morgan, bcrypt, jsonwebtoken.

### 4. Các Design Patterns đã áp dụng — chi tiết, vị trí và lý do

Tóm tắt các patterns chính (vị trí file trong repo) và phân tích.

1) Singleton
 - Files: `Source/backend/src/patterns/singleton/DatabaseConnection.ts`, `CacheManager.ts`, `Logger.ts`.
 - Mô tả: đảm bảo chỉ một instance duy nhất của tài nguyên chia sẻ (Prisma client, cache adapter, logger).
 - Lý do dùng: tránh mở nhiều connection pool tới DB (Prisma), tránh tạo nhiều kết nối đến Redis, và để có cấu hình log/format thống nhất.
 - Ưu điểm vs alternatives:
   - So với global variables: Singleton đóng gói khởi tạo và lifecycle (disconnect/cleanup).
   - So với DI container: nhẹ, không cần dependency injection framework cho project vừa và nhỏ.
 - Khi nào không dùng: nếu cần test isolation cao hoặc multi-tenant isolation, dùng DI để inject mock/instance khác.

2) Factory
 - Files: `Source/backend/src/patterns/factory/CourseFactory.ts`, `UserFactory.ts`.
 - Mô tả: đóng gói logic khởi tạo domain objects (course/user) với validation, defaults, slug generation, hashing mật khẩu.
 - Lý do dùng: giảm duplication khi khởi tạo nhiều biến thể (video course, featured, free, discounted), đảm bảo business rules tại 1 chỗ.
 - Ưu điểm vs alternatives:
   - So với constructors trực tiếp: factory cho phép đặt validation và các bước tiền xử lý dễ mở rộng.
   - So với Builder: nếu object creation phức tạp cần step-by-step, Builder phù hợp hơn; hiện tại Factory đủ cho các variant đã có.

3) Repository
 - File: `Source/backend/src/patterns/repository/Repositories.ts`.
 - Mô tả: lớp trừu tượng hóa dữ liệu (CRUD) giữa business logic và Prisma client.
 - Lý do dùng: tách controller/service khỏi cú pháp ORM, dễ mock cho unit test, chuẩn hóa query (include, pagination, filters).
 - Ưu điểm vs alternatives:
   - So với gọi Prisma trực tiếp trong controller: giảm tight-coupling, dễ bảo trì.
   - So với full DAL bằng raw SQL: Repository vẫn dùng Prisma nhưng tập trung query và tối ưu tại 1 chỗ.

4) Strategy
 - File: `Source/backend/src/patterns/strategy/PricingStrategy.ts`.
 - Mô tả: định nghĩa họ các thuật toán pricing (Regular, BulkDiscount, Subscription, Coupon) và Search strategies.
 - Lý do dùng: cần hoán đổi thuật toán giá/giảm giá tại runtime (ví dụ khi user chọn subscription vs pay-per-course).
 - Ưu điểm vs alternatives:
   - So với if/else rời rạc: Strategy làm sạch các branch logic, thêm chiến lược mới không sửa code hiện có (Open/Closed).
   - So với hard-coded rules: dễ test từng strategy riêng lẻ.

5) Observer / Event Bus
 - File: `Source/backend/src/patterns/observer/EventBus.ts`.
 - Mô tả: publish-subscribe để xử lý event (enrollment, review created, lesson completed) theo cách lỏng lẻo.
 - Lý do dùng: khi 1 action cần nhiều phản ứng (gửi email, cập nhật analytics, thông báo) mà không muốn controller biết chi tiết những hành động đó.
 - Ưu điểm vs alternatives:
   - So với gọi trực tiếp: giảm coupling giữa components.
   - So với message queue: EventBus hiện là in-process; nếu cần scale/process ngoài, có thể thay bằng Kafka/RabbitMQ.

6) Decorator
 - File: `Source/backend/src/patterns/decorator/CourseDecorator.ts`.
 - Mô tả: thêm behavior (discount, featured, bestseller, new, limited-time) vào đối tượng Course mà không cần subclassing.
 - Lý do dùng: tránh class explosion (không cần tạo nhiều lớp con cho mỗi tổ hợp tính năng).
 - Ưu điểm vs alternatives:
   - So với subclassing: linh động hơn, các decorator có thể xếp chồng.
   - So với flags trên model: decorator cho behavior-rich composition (mô tả, badges, price calc) tách rời logic trình bày.

### 5. Các quyết định thiết kế — tại sao chọn pattern này ở chỗ này

- Tập trung vào maintainability và testability: Repository & Factory giúp test unit dễ hơn vì có thể mock truy vấn và tách logic khởi tạo.
- Hiệu năng & resource management: Singleton cho Prisma/Redis để giữ connection pool tối ưu.
- Tính linh hoạt runtime: Strategy và Decorator giúp hoán đổi thuật toán/behavior mà không sửa code business core.
- Khả năng mở rộng: EventBus cho phép thêm observers (ví dụ: analytics, email, notification) mà không chạm controller.

### 6. Ưu và nhược điểm tổng quát (so sánh ngắn)

- Singleton
  - +: đơn giản, kiểm soát lifecycle, tiết kiệm resources.
  - -: có thể gây khó test nếu không support injection; dễ thành global state unsafe.

- Factory
  - +: tập trung valid/initialization.
  - -: nếu object quá phức tạp, cần Builder.

- Repository
  - +: tách tầng persistence, dễ mock/test.
  - -: có thể thêm 1 lớp abstraction thừa nếu repository chỉ bọc 1-1 các lệnh ORM.

- Strategy
  - +: loại trừ if/else, testable.
  - -: số lượng strategy nhiều cần quản lý; đôi khi quá thiết kế cho trường hợp đơn giản.

- Observer
  - +: loose coupling, dễ mở rộng handlers.
  - -: khó debug luồng event khi nhiều observer; ordering/transactional issues (không atomic).

- Decorator
  - +: compose behaviors runtime.
  - -: khi stack decorator quá nhiều có thể khó theo dõi thứ tự áp dụng.

### 7. Gợi ý cải tiến (low-risk, có thể áp dụng ngay)

- Thay `CacheManager` mock bằng `ioredis` hoặc `redis` client trong production và cấu hình retry/connection pooling (`Source/backend/src/patterns/singleton/CacheManager.ts`).
- Dùng logging library chuyên nghiệp (`pino` / `winston`) thay vì console wrapper trong `Logger` để hỗ trợ structured logs và transport.
- Nếu muốn testability/loose-coupling tốt hơn, cân nhắc DI container nhẹ như `tsyringe` để inject Repository/Services thay vì new trực tiếp.
- Nếu hệ thống cần scale event processing, thay EventBus in-process bằng message broker (RabbitMQ/Kafka) để xử lý bất đồng bộ và đảm bảo delivery.

### 8. Kết luận

Project đã áp dụng một tập hợp design patterns phù hợp với mục tiêu: code dễ đọc, dễ mở rộng, testable và quản lý resource hiệu quả. Mỗi pattern được dùng đúng ngữ cảnh: Singleton cho tài nguyên đắt tiền; Factory/Repository cho việc tách trách nhiệm và chuẩn hóa logic; Strategy/Decorator/Observer cho tính linh hoạt behavior và mở rộng mà không tác động nhiều tới core code.

File tham khảo chính trong repo:
- `Source/backend/src/patterns/singleton/DatabaseConnection.ts`
- `Source/backend/src/patterns/factory/CourseFactory.ts`
- `Source/backend/src/patterns/repository/Repositories.ts`
- `Source/backend/src/patterns/strategy/PricingStrategy.ts`
- `Source/backend/src/patterns/observer/EventBus.ts`
- `Source/backend/src/patterns/decorator/CourseDecorator.ts`

Nếu bạn muốn, tôi có thể:
- Chỉnh sửa `README.md` để chèn bản tóm tắt này.
- Tạo slide/giấy tờ thuyết trình tóm tắt (pptx/markdown).
- Viết unit tests minh hoạ cho từng pattern (1-2 test mỗi pattern).

Hoàn tất — báo cáo đã tạo tại `REPORT.md` ở root repo.
