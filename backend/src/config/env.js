import dotenv from 'dotenv';
dotenv.config();

/**
 * Validates essential environment variables on backend boot.
 * Throws early warnings or errors if vital variables are missing.
 */
export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sbvm_school',
  JWT_SECRET: process.env.JWT_SECRET || 'sbvm_jwt_access_secret_development_key_2026',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'sbvm_jwt_refresh_secret_development_key_2026',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  CHROMA_URL: process.env.CHROMA_URL || 'http://localhost:8000',
  SEED_ADMIN_EMAIL: process.env.SEED_ADMIN_EMAIL || 'admin@sbvm.edu.in',
  SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD || 'adminPassword123'
};

if (env.NODE_ENV === 'production') {
  const missingKeys = [];
  if (!process.env.JWT_SECRET) missingKeys.push('JWT_SECRET');
  if (!process.env.JWT_REFRESH_SECRET) missingKeys.push('JWT_REFRESH_SECRET');
  if (!process.env.MONGO_URI) missingKeys.push('MONGO_URI');

  if (missingKeys.length > 0) {
    console.error(`[CRITICAL] Missing required environment variables in production: ${missingKeys.join(', ')}`);
  }
}
