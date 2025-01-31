import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL || '',
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || 12,
  default_password: process.env.DEFAULT_PASSOWRD,
  node_env: process.env.NODE_ENV,
  jwt_access_token: process.env.JWT_ACCESS_TOKEN,
};
