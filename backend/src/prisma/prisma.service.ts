import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super();
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Aranyak Jewellers: Connected to MongoDB successfully!');
    } catch (error) {
      console.error(
        '❌ Aranyak Jewellers: MongoDB Connection Failed:',
        error,
      );
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
