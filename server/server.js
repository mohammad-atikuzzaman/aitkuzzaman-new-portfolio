import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (process.env.MONGODB_URI) {
      await connectDB();
    } else {
      console.log('⚠️ Running in local mode without MONGODB_URI. Add it to .env to connect to database.');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Portfolio backend running at http://localhost:${PORT}`);
      console.log(`📡 API endpoints ready at http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
