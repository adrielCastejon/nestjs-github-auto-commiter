import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { execSync } from 'child_process';
import { format } from 'date-fns';
import { appendFileSync, readFileSync } from 'fs';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);
  private readonly commitMessages: string[];
  private readonly targetFile = 'commits.log';

  constructor(private schedulerRegistry: SchedulerRegistry) {
    this.commitMessages = readFileSync('commit-messages.txt', 'utf8')
      .split('\n')
      .filter((msg) => msg.trim().length > 0);
  }

  async onModuleInit() {
    this.logger.log('Application started - executing initial commit process');

    await this.handleCommits();

    const now = new Date();
    const currentHour = now.getHours();

    const sameDayTime = `0 0 ${currentHour} * * *`;
    const sameDayJob = new CronJob(sameDayTime, () => {
      this.handleCommits();
    });

    const offsetHour = (currentHour + 12) % 24;
    const offsetDayTime = `0 0 ${offsetHour} * * *`;
    const offsetDayJob = new CronJob(offsetDayTime, () => {
      this.handleCommits();
    });

    this.schedulerRegistry.addCronJob('same-time-job', sameDayJob);
    this.schedulerRegistry.addCronJob('offset-time-job', offsetDayJob);

    sameDayJob.start();
    offsetDayJob.start();

    this.logger.log(
      `Scheduled jobs for ${currentHour}:00 and ${offsetHour}:00 daily`,
    );
  }

  handleCommits(): void {
    this.logger.log('Starting commit process');
    const commitCount = this.calculateCommitCount();
    this.logger.log(`Today's commit count: ${commitCount}`);

    this.executeCommits(commitCount);
    this.pushChanges();
  }

  private calculateCommitCount(): number {
    const rand = Math.random();
    if (rand < 0.5) return 1;
    if (rand < 0.75) return 2;
    if (rand < 0.875) return 3;
    return 4 + Math.floor(Math.random() * 3);
  }

  private executeCommits(commitCount: number): void {
    for (let i = 0; i < commitCount; i++) {
      try {
        appendFileSync(
          this.targetFile,
          `${format(new Date(), 'yyyy-MM-dd HH:mm:ss')} - Commit ${i + 1}\n`,
        );
        execSync('git add .');

        const message =
          this.commitMessages[
            Math.floor(Math.random() * this.commitMessages.length)
          ];
        execSync(`git commit -m "${message}" --allow-empty`);

        this.logger.debug(`Commit ${i + 1} realizado: ${message}`);
      } catch (error) {
        this.logger.error(`Falha no commit ${i + 1}: ${error}`);
      }
    }
  }

  private pushChanges() {
    try {
      execSync('git push origin main');
      this.logger.log('Push realizado com sucesso');
    } catch (error) {
      this.logger.error(`Erro no push: ${error}`);
    }
  }
}
