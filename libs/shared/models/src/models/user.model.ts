import { Project } from './project.model';

export interface User {
  id: number;
  googleId: string;
  name?: string;
  email: string;
  projects: Project[];
}
