import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { Admin } from '../models/Admin.js';

export const seedAdmin = async (): Promise<void> => {
  const passwordHash = await bcrypt.hash(env.adminPassword, 12);

  await Admin.findOneAndUpdate(
    { email: env.adminEmail.toLowerCase() },
    {
      name: env.adminName,
      email: env.adminEmail.toLowerCase(),
      passwordHash,
      role: 'admin'
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(`Admin ready: ${env.adminEmail}`);
};
