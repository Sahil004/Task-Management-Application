import { HydratedDocument, InferSchemaType, Schema, Types, model } from 'mongoose';

export const taskPriorities = ['low', 'medium', 'high'] as const;
export const taskStatuses = ['todo', 'in-progress', 'done'] as const;

export type TaskPriority = (typeof taskPriorities)[number];
export type TaskStatus = (typeof taskStatuses)[number];

const taskSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    priority: {
      type: String,
      enum: taskPriorities,
      default: 'medium',
      index: true,
    },
    status: {
      type: String,
      enum: taskStatuses,
      default: 'todo',
      index: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    position: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, priority: 1 });
taskSchema.index({ user: 1, dueDate: 1 });
taskSchema.index({ user: 1, createdAt: -1 });

taskSchema.virtual('isOverdue').get(function isOverdue(this: HydratedDocument<ITask>) {
  return Boolean(this.dueDate && this.status !== 'done' && new Date() > this.dueDate);
});

taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

type TaskSchema = InferSchemaType<typeof taskSchema>;

export interface ITask extends TaskSchema {
  user: Types.ObjectId;
}

export const Task = model<ITask>('Task', taskSchema);
