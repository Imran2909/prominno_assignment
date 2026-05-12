import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = ['MONGO_URI', 'JWT_SECRET'] as const;

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  port: Number(process.env.PORT ?? 5000),
  mongoUri: process.env.MONGO_URI as string,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  adminName: process.env.ADMIN_NAME ?? 'Prominno Admin',
  adminEmail: process.env.ADMIN_EMAIL ?? 'admin@prominno.com',
  adminPassword: process.env.ADMIN_PASSWORD ?? 'Admin@12345',
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173'
};
