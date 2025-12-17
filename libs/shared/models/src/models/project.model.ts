import { Task } from './task.model';

export interface Project {
  id: number;
  creatorId: number;
  name: string;
  description?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
  tasks: Task[];
}

export type ProjectInput = Pick<Project, 'name' | 'description' | 'color'>;

export type ProjectUpdate = Partial<Omit<Project, 'id' | 'creatorId' | 'createdAt' | 'updatedAt' | 'tasks'>>;