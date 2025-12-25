/**
 * @file Provides a service to deal with the database in the background.
 */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

import * as dotenv from 'dotenv';
import { expand } from 'dotenv-expand';

const env = dotenv.config({ path: '.env' });
expand(env);

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);

    super({ adapter });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }
}
