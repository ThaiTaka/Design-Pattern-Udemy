const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function killProcessOnPort(port) {
  try {
    if (process.platform === 'win32') {
      // Windows: Tìm PID từ port và kill
      const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
      const lines = stdout.split('\n').filter(line => line.includes('LISTENING'));
      
      if (lines.length > 0) {
        const pids = new Set();
        lines.forEach(line => {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          if (pid && pid !== '0') {
            pids.add(pid);
          }
        });

        for (const pid of pids) {
          try {
            await execAsync(`taskkill /F /PID ${pid}`);
            console.log(`✅ Đã dừng process trên port ${port} (PID: ${pid})`);
          } catch (e) {
            // Ignore nếu process đã tắt
          }
        }
      } else {
        console.log(`ℹ️  Không có process nào chạy trên port ${port}`);
      }
    } else {
      // Linux/Mac: sử dụng lsof
      try {
        await execAsync(`lsof -ti:${port} | xargs kill -9`);
        console.log(`✅ Đã dừng process trên port ${port}`);
      } catch (e) {
        console.log(`ℹ️  Không có process nào chạy trên port ${port}`);
      }
    }
  } catch (error) {
    console.log(`ℹ️  Không có process nào chạy trên port ${port}`);
  }
}

async function cleanup() {
  console.log('🧹 Đang dọn dẹp các process cũ...\n');
  
  // Kill process trên port 3000 (Frontend)
  await killProcessOnPort(3000);
  
  // Kill process trên port 5000 (Backend)
  await killProcessOnPort(5000);
  
  // Kill process trên port 5555 (Prisma Studio - nếu đang chạy)
  await killProcessOnPort(5555);
  
  console.log('\n✨ Dọn dẹp hoàn tất! Bắt đầu khởi động...\n');
}

cleanup().catch(console.error);
