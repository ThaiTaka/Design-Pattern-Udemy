# 🎮 CÁCH SỬ DỤNG - E-LEARNING PLATFORM

## 🚀 Quick Start (Dành cho người mới)

### Bước 1: Cài đặt lần đầu
**Double-click** file: `install-dependencies.bat`
- Chương trình sẽ tự động cài đặt tất cả những gì cần thiết
- Chờ khoảng 5-10 phút
- ⚠️ Cần kết nối Internet

### Bước 2: Khởi động Docker Desktop
- Mở **Docker Desktop** từ Start Menu
- Đợi cho đến khi icon Docker ở system tray chuyển sang màu xanh

### Bước 3: Chạy ứng dụng
**Double-click** file: `start-elearning.bat`
- Cửa sổ terminal sẽ mở ra
- Chờ khoảng 1-2 phút
- Trình duyệt sẽ tự động mở trang web

### Bước 4: Sử dụng
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database Admin**: http://localhost:8080

**Test Accounts:**
- Email: `student@test.com` 
- Password: `password123`

### Bước 5: Dừng ứng dụng
**Double-click** file: `stop-elearning.bat`
- Hoặc đóng cửa sổ terminal (Ctrl+C)

---

## 📦 Các file quan trọng

```
📁 udemy/
├── 🟢 install-dependencies.bat  ← Chạy lần đầu tiên
├── 🚀 start-elearning.bat       ← Khởi động app
├── 🛑 stop-elearning.bat        ← Dừng app
├── 📖 HOW-TO-CREATE-EXE.md      ← Hướng dẫn tạo file .exe
├── 📖 REPORT.md                 ← Báo cáo Design Patterns
├── 📖 SETUP.md                  ← Hướng dẫn setup chi tiết
└── 📖 README.md                 ← Tài liệu chính
```

---

## 🔧 Yêu cầu hệ thống

### Phần mềm cần cài đặt:
1. ✅ **Node.js 18+** 
   - Download: https://nodejs.org/
   - Chọn phiên bản LTS

2. ✅ **Docker Desktop**
   - Download: https://www.docker.com/products/docker-desktop/

3. ✅ **Git** (optional)
   - Download: https://git-scm.com/

### Cấu hình tối thiểu:
- **RAM**: 8GB+ (khuyến nghị 16GB)
- **Disk**: 10GB trống
- **OS**: Windows 10/11
- **Internet**: Cần có khi cài đặt

---

## 🐛 Xử lý lỗi thường gặp

### Lỗi 1: "Docker is not running"
**Giải pháp:**
1. Mở Docker Desktop
2. Đợi icon Docker ở system tray chuyển xanh
3. Chạy lại `start-elearning.bat`

### Lỗi 2: "Port 3000 is already in use"
**Giải pháp:**
```bash
# Chạy file stop-elearning.bat
# Hoặc mở PowerShell và chạy:
npx kill-port 3000 5000
```

### Lỗi 3: "Database connection failed"
**Giải pháp:**
1. Chạy `stop-elearning.bat`
2. Mở Docker Desktop → Containers → Xóa tất cả containers cũ
3. Chạy lại `start-elearning.bat`

### Lỗi 4: "npm: command not found"
**Giải pháp:**
- Node.js chưa được cài đặt
- Download và cài từ: https://nodejs.org/
- Khởi động lại máy tính sau khi cài

---

## 📱 Các trang quan trọng

### Frontend (Port 3000)
- **Homepage**: http://localhost:3000/
- **Courses**: http://localhost:3000/courses
- **Login**: http://localhost:3000/login
- **Dashboard**: http://localhost:3000/dashboard

### Backend (Port 5000)
- **API Root**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

### Database Admin (Port 8080)
- **Adminer**: http://localhost:8080
  - Server: `postgres`
  - Username: `elearning`
  - Password: `elearning123`
  - Database: `elearning`

---

## 🎯 Tips & Tricks

### Tip 1: Chạy nhanh từ lần 2
Từ lần 2 trở đi, chỉ cần:
1. Mở Docker Desktop
2. Double-click `start-elearning.bat`

### Tip 2: Debug mode
Nếu có lỗi, mở terminal và chạy:
```bash
npm run dev
```
Sẽ thấy chi tiết lỗi hơn.

### Tip 3: Xem logs
- **Backend logs**: Xem trong terminal
- **Docker logs**: Docker Desktop → Containers → Click vào container
- **Frontend logs**: Mở Developer Tools (F12) trong browser

### Tip 4: Reset toàn bộ
Nếu có vấn đề nghiêm trọng:
```bash
# 1. Dừng ứng dụng
stop-elearning.bat

# 2. Xóa database
cd Executable
docker-compose down -v

# 3. Chạy lại
cd ..
start-elearning.bat
```

---

## 📚 Tài liệu thêm

- **Design Patterns**: Xem file `REPORT.md`
- **Setup chi tiết**: Xem file `SETUP.md`
- **Tạo file EXE**: Xem file `HOW-TO-CREATE-EXE.md`
- **README chính**: Xem file `README.md`

---

## 💡 Muốn tạo file .EXE?

Xem hướng dẫn chi tiết trong file: `HOW-TO-CREATE-EXE.md`

**Tóm tắt nhanh:**
1. Download **Bat To Exe Converter**: https://www.f2ko.de/en/b2e.php
2. Open → Chọn `start-elearning.bat`
3. Compile → Lưu thành `ELearn-Start.exe`
4. Done! Giờ có thể double-click file `.exe` để chạy

---

## 🆘 Cần hỗ trợ?

1. **Đọc phần "Xử lý lỗi" ở trên**
2. **Xem logs** trong terminal
3. **Check Docker** đã chạy chưa
4. **Restart** máy tính và thử lại

---

## ✨ Features

- ✅ One-click startup
- ✅ Tự động start Docker
- ✅ Tự động setup database
- ✅ Tự động mở browser
- ✅ Hot reload (code changes tự động refresh)
- ✅ Professional UI/UX
- ✅ 6 Design Patterns implemented

---

**Made with ❤️ by ThaiTaka**
**© 2025 E-Learning Platform**
