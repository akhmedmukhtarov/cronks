import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { CRON_QUEUE_NAME } from './constants';
import { CronProcessor } from './processor';

/**
 * A service for registering and managing cron jobs using BullMQ.
 * Provides methods to schedule and delete cron jobs.
 */
@Injectable()
export class CronksService {
  constructor(
    @InjectQueue(CRON_QUEUE_NAME) private cronQueue: Queue,
    @Inject(CronProcessor) private readonly processor: CronProcessor,
  ) {}

  /**
   * Registers a cron job with the specified options and callback.
   *
   * @param options - Configuration for the cron job.
   * @param options.name - Unique name for the cron job.
   * @param options.pattern - Cron pattern (e.g., '* * * * *' for every minute).
   * @param options.timezone - Optional timezone (e.g., 'America/Chicago').
   * @param cb - Callback function to execute when the job runs.
   * @returns A promise that resolves when the job is registered.
   *
   * @example
   * ```typescript
   * import { Injectable } from '@nestjs/common';
   * import { CronksService, CronPatterns } from 'cronks';
   *
   * @Injectable()
   * class MyService {
   *   constructor(private readonly cronksService: CronksService) {}
   *
   *   async registerJob() {
   *     await this.cronksService.registerCronJob(
   *       {
   *         name: 'my-job',
   *         pattern: CronPatterns.EVERY_10_SECONDS,
   *         timezone: 'America/Chicago',
   *       },
   *       async (job) => {
   *         console.log('Job executed:', job.name);
   *       },
   *     );
   *   }
   * }
   * ```
   */
  async registerCronJob(
    options: {
      name: string;
      pattern: string;
      timezone?: string;
    },
    cb: (job: any) => Promise<any> | any,
  ) {
    this.processor.registerHandler(options.name, cb);
    await this.cronQueue.add(
      options.name,
      {},
      {
        repeat: {
          pattern: options.pattern,
          tz: options.timezone,
        },
      },
    );
  }

  /**
   * Deletes a cron job by its name, pattern, and optional timezone.
   *
   * @param name - The name of the cron job to delete.
   * @param pattern - The cron pattern used when registering the job.
   * @param timezone - Optional timezone used when registering the job.
   * @returns A promise that resolves to `true` if the job was deleted.
   * @throws Error if the job could not be deleted.
   *
   * @example
   * ```typescript
   * import { Injectable } from '@nestjs/common';
   * import { CronksService, CronPatterns } from 'cronks';
   *
   * @Injectable()
   * export class MyService {
   *   constructor(private readonly cronksService: CronksService) {}
   *
   *   async deleteJob() {
   *     try {
   *       await this.cronksService.deleteCronJob(
   *         'my-job',
   *         CronPatterns.EVERY_10_SECONDS,
   *         'America/Chicago',
   *       );
   *       console.log('Job deleted');
   *     } catch (error) {
   *       console.error('Deletion failed:', error.message);
   *     }
   *   }
   * }
   * ```
   */
  async deleteCronJob(name: string, pattern: string, timezone?: string) {
    const removed = await this.cronQueue.removeRepeatable(name, {
      pattern,
      tz: timezone,
    });
    if (!removed) {
      throw new Error(`Failed to delete cron job: ${name}`);
    }
    return true;
  }
}
