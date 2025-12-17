export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  projectId: number;
}

export type TaskInput = Pick<Task, 'title' | 'description'> & { projectId?: number; status?: string };

export type TaskUpdate = Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'projectId'>>;
