import { Task } from './task.model';

export interface Project {
  id: number;
  creatorId: number;
  name: string;
  description?: string;
  color?: string;
  createdAt: Date;
  tasks: Task[];
}
