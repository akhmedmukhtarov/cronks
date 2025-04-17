import { BullModule } from '@nestjs/bullmq';
import { DynamicModule, Module } from '@nestjs/common';
import { CRON_QUEUE_NAME } from './constants';
import { CronProcessor } from './processor';
import { CronksService } from './service';

/**
 * A NestJS module for scheduling and managing cron jobs using BullMQ.
 * Provides dynamic registration with Redis configuration.
 */
@Module({})
export class CronksModule {
  /**
   * Registers the cron module with Redis connection settings.
   *
   * @param redisConfig - Configuration for the Redis connection.
   * @param redisConfig.host - The Redis server host (e.g., 'localhost').
   * @param redisConfig.port - The Redis server port (e.g., 6379).
   * @param redisConfig.password - Optional Redis password for authentication.
   * @returns A dynamic module with the cron queue and providers.
   *
   * @example
   * ```typescript
   * import { Module } from '@nestjs/common';
   * import { CronksModule } from 'cronks';
   *
   * @Module({
   *   imports: [
   *     CronksModule.register({
   *       host: 'localhost',
   *       port: 6379,
   *       password: 'your-redis-password',
   *     }),
   *   ],
   * })
   * export class AppModule {}
   * ```
   */
  static register(redisConfig: {
    host: string;
    port: number;
    password?: string;
  }): DynamicModule {
    return {
      module: CronksModule,
      imports: [
        BullModule.registerQueue({
          name: CRON_QUEUE_NAME,
          connection: {
            host: redisConfig.host,
            port: redisConfig.port,
            password: redisConfig.password,
          },
        }),
      ],
      providers: [CronksService, CronProcessor],
      exports: [CronksService, CronProcessor],
    };
  }
}
