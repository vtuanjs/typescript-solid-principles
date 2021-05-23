import { Schema, BaseRepository } from '@vtjs/mongoose';
import Task from '../entities/task.entity';

const taskSchema = new Schema(
  {
    userId: String,
    title: String,
    description: String,
    startTime: {
      type: Date,
      default: Date.now
    },
    endTime: {
      type: Date,
      default: Date.now
    },
    deadline: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    versionKey: false,
    autoCreate: true
  }
);

export default class TaskRepository extends BaseRepository<Task> {
  constructor() {
    super('task', taskSchema, 'tasks');
  }
}
