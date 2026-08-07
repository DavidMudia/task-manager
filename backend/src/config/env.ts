

const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  env: {
    port: process.env.PORT || 5000,
    jwtSecret: process.env.JWT_SECRET || 'default-secret',
    databaseUrl: process.env.DATABASE_URL,
  }
};
export {};