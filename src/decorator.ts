import { Inject } from '@nestjs/common';
import { CronProcessor } from './processor';
import { CronksService } from './service';

/**
 * A decorator to schedule a method as a cron job using BullMQ.
 * Registers the method with the specified cron pattern and optional name/timezone.
 * The method will be executed according to the cron schedule.
 *
 * @param pattern - The cron pattern (e.g., '* * * * *' for every minute) or a `CronPatterns` enum value.
 * @param options - Optional configuration for the cron job.
 * @param options.name - Custom name for the cron job. Defaults to `<ClassName>.<methodName>`.
 * @param options.timezone - Timezone for the cron schedule (e.g., 'America/Chicago').
 *
 * @example
 * ```typescript
 * import { Injectable } from '@nestjs/common';
 * import { Cron, CronPatterns } from '@xai/cron';
 *
 * @Injectable()
 * export class MyService {
 *   @Cron(CronPatterns.EVERY_10_SECONDS, { name: 'quick-task' })
 *   async myJob() {
 *     console.log('Runs every 10 seconds');
 *   }
 *   @Cron(CronPatterns.EVERY_5_SECONDS)
 *   async myJob1() {
 *     console.log('Runs every 5 seconds');
 *   }
 * }
 * ```
 */

export function Cron(
  pattern: string,
  options?: { name?: string; timezone?: string },
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    Inject(CronksService)(target, 'cronQueueService');
    Inject(CronProcessor)(target, 'cronProcessor');

    const registerCron = async function () {
      const instance = this as any;
      const jobName =
        options?.name ?? `${target.constructor.name}.${propertyKey}`;

      await instance.cronQueueService.registerCronJob(
        { name: jobName, pattern, timezone: options?.timezone },
        originalMethod.bind(instance),
      );
    };

    const originalOnModuleInit = target.onModuleInit;
    target.onModuleInit = async function () {
      if (originalOnModuleInit) {
        await originalOnModuleInit.call(this);
      }
      await registerCron.call(this);
    };

    return descriptor;
  };
}
