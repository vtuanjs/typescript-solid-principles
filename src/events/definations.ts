import { IntegrationEvent, IIntegrationEvent } from '@vtjs/rabbitmq';
import { ACTIVITY_CREATE_EVENT } from '../configs';
import { ActivityAction } from '../entities/activity.entity';

export class ActivityCreateEvent extends IntegrationEvent {
  constructor({
    userId,
    action,
    refId,
    data
  }: {
    userId: string;
    action: ActivityAction;
    refId: string;
    data: any;
  }) {
    super({
      name: ACTIVITY_CREATE_EVENT,
      data: {
        userId,
        action,
        refId,
        data
      }
    });
  }
}
