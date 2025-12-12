import { Component } from '@angular/core';
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
  imports: [CreateTaskComponent, TaskCardComponent],
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
}
