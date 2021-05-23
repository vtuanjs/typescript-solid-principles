import { Schema, BaseRepository, Mixed } from '@vtjs/mongoose';
import Activity from '../entities/activity.entity';

const activitySchema = new Schema(
  {
    userId: String,
    action: String,
    refId: String,
    data: Mixed
  },
  {
    timestamps: true,
    versionKey: false,
    autoCreate: true
  }
);

export default class ActivityRepository extends BaseRepository<Activity> {
  constructor() {
    super('activity', activitySchema, 'activities');
  }
}
