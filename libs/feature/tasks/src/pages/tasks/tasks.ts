import { Component } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CreateTaskComponent } from '../../components/create-task/create-task';
import { TaskCardComponent } from '../../components/task-card/task-card';

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

interface TaskInput {
  title: string;
  description: string;
}

@Component({
  selector: 'tn-tasks',
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
  imports: [CreateTaskComponent, TaskCardComponent, ScrollingModule],
})
export class Tasks {
  tasks: Task[] = [];
  nextId = 1;

  onTaskCreated(taskInput: TaskInput) {
    const newTask: Task = {
      id: this.nextId++,
      title: taskInput.title,
      description: taskInput.description,
      completed: false,
      createdAt: new Date(),
    };
    this.tasks.push(newTask);
  }

  deleteTask(id: number) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  toggleTask(id: number) {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
    }
  }

  generateRandomTasks() {
    const titles = [
      'Review code',
      'Fix bug',
      'Update documentation',
      'Add unit tests',
      'Refactor component',
      'Optimize performance',
      'Deploy to production',
      'Create API endpoint',
      'Design database schema',
      'Write technical spec',
      'Implement feature',
      'Setup CI/CD',
      'Configure environment',
      'Handle edge cases',
      'Improve UX',
    ];

    const descriptions = [
      'This needs to be completed ASAP',
      'Follow coding standards',
      'Include comments and documentation',
      'Add error handling',
      'Test thoroughly before merging',
      'Get approval from lead',
      'Update related tests',
      'Check cross-browser compatibility',
      '',
      '',
    ];

    for (let i = 0; i < 100; i++) {
      const randomTitle = titles[Math.floor(Math.random() * titles.length)];
      const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
      const randomCompleted = Math.random() > 0.7;
      const randomDaysAgo = Math.floor(Math.random() * 30);

      const newTask: Task = {
        id: this.nextId++,
        title: `${randomTitle} #${this.nextId}`,
        description: randomDesc,
        completed: randomCompleted,
        createdAt: new Date(Date.now() - randomDaysAgo * 24 * 60 * 60 * 1000),
      };
      this.tasks.push(newTask);
    }
  }
}
