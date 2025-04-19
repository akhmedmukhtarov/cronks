import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger, OnModuleInit } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { CRON_QUEUE_NAME } from './constants';

@Processor(CRON_QUEUE_NAME)
export class CronProcessor extends WorkerHost implements OnModuleInit {
  constructor(@InjectQueue(CRON_QUEUE_NAME) private cronQueue: Queue) {
    super();
  }
  private readonly logger = new Logger(CronProcessor.name);
  private readonly handlers: Map<string, (job: Job) => Promise<any> | any> =
    new Map();

  async onModuleInit() {
    await this.cronQueue.obliterate({ force: true }).catch(() => {});
  }

  async process(job: Job): Promise<any> {
    const handler = this.handlers.get(job.name);
    if (!handler) {
      this.logger.warn(`No handler registered for job: ${job.name}`);
      return;
    }
    return handler(job);
  }

  registerHandler(name: string, handler: (job: Job) => Promise<any> | any) {
    this.handlers.set(name, handler);
  }
}
