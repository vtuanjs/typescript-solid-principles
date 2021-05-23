import { BaseEvent } from '@vtjs/rabbitmq';
import { ILogger } from '@vtjs/common';
import { ActivityCreateEvent } from './definations';
import { IActivityService } from '../services/definations';

export default class ActivityEvent extends BaseEvent {
  constructor(private activityService: IActivityService, private logger: ILogger) {
    super();
  }

  async handle(event: ActivityCreateEvent, done: (arg?: Error) => void): Promise<void> {
    try {
      await this.activityService.create(event.data);
    } catch (error) {
      this.logger.warn('Create activity error', error);
    } finally {
      done();
    }
  }
}
