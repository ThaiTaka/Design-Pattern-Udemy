const { exec } = require('child_process');

let retries = 0;
const maxRetries = 30;

function checkDatabase() {
  exec('docker exec elearning-postgres pg_isready -U elearning', (error) => {
    if (error) {
      retries++;
      if (retries < maxRetries) {
        console.log(`⏳ Waiting for database... (${retries}/${maxRetries})`);
        setTimeout(checkDatabase, 1000);
      } else {
        console.error('❌ Database connection timeout. Please check Docker Desktop is running.');
        process.exit(1);
      }
    } else {
      console.log('✅ Database is ready!');
      console.log('🚀 Starting application services...\n');
    }
  });
}

console.log('🔍 Checking database connection...');
checkDatabase();
