import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from 'database';

const db = new PrismaClient({
  log: ['query'],
  errorFormat: 'pretty',
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
}
