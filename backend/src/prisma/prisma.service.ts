import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { Logger } from '@nestjs/common';

const logger = new Logger('PrismaService');
const MAX_RETRIES = 100; // Set the maximum number of retries

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  blocking: any;

  constructor() {
    super();
    this.blocking = null;
  }

  async onModuleInit() {
    let retries = 0;

    while (retries < MAX_RETRIES) {
      try {
        await this.$connect();
        break; // If connection succeeds, exit the loop
      } catch (error) {
        retries++;
        logger.error(
          `Failed to connect to the database. NETWORK DOWN (Retry ${retries}/${MAX_RETRIES})`,
        );

        if (retries === MAX_RETRIES) {
          if (error instanceof Prisma.PrismaClientInitializationError)
            logger.error(
              'Prisma Error: ' +
                error.message +
                'Reset the count and try again',
            );
          retries = 0;
        }

        // Delay before the next retry (you can adjust this delay as needed)
        await new Promise((resolve) => setTimeout(resolve, 10000));
      }
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
