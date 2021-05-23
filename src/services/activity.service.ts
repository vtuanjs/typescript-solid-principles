import { BaseService, ILogger, ServiceCache } from '@vtjs/common';

import { IActivityService } from './definations';
import Activity from '../entities/activity.entity';
import { IActivityRepository } from '../repositories/definations';

type ActivityServiceProp = {
  repo: IActivityRepository;
  logger: ILogger;
};

export default class ActivityService extends BaseService<Activity> implements IActivityService {
  // Declare repo type if you need handle another function
  // repo: IActivityRepository;
  constructor({ repo, logger }: ActivityServiceProp) {
    // Set cache = undefined if you don't need using cache
    super(repo, undefined, logger);
  }
}
