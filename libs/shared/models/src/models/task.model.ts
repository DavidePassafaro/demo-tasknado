export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  createdAt: Date;
  dueDate?: Date;
  projectId: number;
}
