
![Logo](https://upload.wikimedia.org/wikipedia/en/thumb/9/96/Meme_Man_on_transparent_background.webp/316px-Meme_Man_on_transparent_background.webp.png)


# Cronks

A robust package designed to guarantee that a task executes exactly once, seamlessly coordinating across multiple instances of a horizontally scaled application, ensuring reliability and consistency in distributed environments


## Installation

Install cronks 

```bash
  npm install cronks
```
```bash
  yarn add cronks
``` 
## Usage/Examples
Registering module
```typescript
import { Module } from '@nestjs/common';
import { CronksModule } from 'cronks';

@Module({
  imports: [
    CronksModule.register({
      host: 'localhost',
      port: 6379,
      password: 'your-redis-password',
    }),
  ],
})
export class AppModule {}
```
Using decorator

```typescript
import { Injectable } from '@nestjs/common';
import { Cron, CronPatterns } from 'cronks';
 
@Injectable()
export class MyService {

  @Cron(CronPatterns.EVERY_10_SECONDS, { name: 'quick-task'})
  async myJob() {
    console.log('Runs every 10 seconds');
  }

  @Cron('*/5 * * * * *')
  async myJob1() {
    console.log('Runs every 5 seconds');
  }
}
```

Or dynamic way, via CronksService

```typescript
import { Injectable } from '@nestjs/common';
import { CronksService, CronPatterns } from 'cronks';

@Injectable()
export class MyService {
  constructor(private readonly cronksService: CronksService) {}

   async deleteJob() {
     try {
       await this.cronksService.deleteCronJob(
         'my-job',
         CronPatterns.EVERY_10_SECONDS,
         'America/Chicago', //if given tz
       );
       console.log('Job deleted');
     } catch (error) {
       console.error('Deletion failed:', error.message);
     }
   }

   async registerJob() {
     await this.cronksService.registerCronJob({
          name: 'my-job',
          pattern: CronPatterns.EVERY_10_SECONDS,
          timezone: 'America/Chicago',
        },
        async (job) => {
          console.log('Job executed:', job.name);
        });
    }
 }
```

## 🔗 Links
[![portfolio](https://internalnote.com/content/images/size/w1200/2023/04/Apple-TV-4K-Copy-60@0.5x.jpg)](https://github.com/akhmedmukhtarov/cronks.git)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](www.linkedin.com/in/akhmed-mukhtarov-abb109231)


