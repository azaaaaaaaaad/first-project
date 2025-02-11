import app from './app';
import config from './app/config';
import mongoose from 'mongoose';
import { Server } from 'http';
import seedSuperAdmin from './app/DB';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    seedSuperAdmin()
    server = app.listen(config.port, () => {
      console.log(`welcome to backend port ${config.port}`);
    });
  } catch (error) {
    console.error(error);
  }
}

main();

process.on('unhandledRejection', () => {
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit();
});

process.on('uncaughtException', () => {
  process.exit(1);
});
