import { Component } from '@angular/core';
import { PrimaryButtonComponent, PrimaryCardComponent, BenefitCardComponent } from '@shared/ui';
import { LineChartComponent } from '@shared/ui/charts';
import type { LineChartData } from '@shared/ui/charts';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'tn-home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
  imports: [PrimaryButtonComponent, PrimaryCardComponent, BenefitCardComponent, LineChartComponent],
})
export class HomePage {
  features: Feature[] = [
    {
      icon: '📋',
      title: 'Task Management',
      description: 'Organize and track all your tasks in one place with priorities and deadlines',
    },
    {
      icon: '👥',
      title: 'Team Collaboration',
      description: 'Work together with your team in real time with assignments and comments',
    },
    {
      icon: '📊',
      title: 'Analytics & Reports',
      description: 'View progress with intuitive dashboards and detailed reports',
    },
    {
      icon: '📅',
      title: 'Timelines & Calendars',
      description: 'Plan your projects with timeline views and interactive calendars',
    },
    {
      icon: '🔔',
      title: 'Notifications & Reminders',
      description: 'Get instant notifications for deadlines and important updates',
    },
    {
      icon: '⚡',
      title: 'Automations',
      description: 'Automate workflows and save time on repetitive tasks',
    },
  ];

  chartData: LineChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [45, 52, 48, 65, 72],
        borderColor: '#667eea',
      },
      {
        label: 'Tasks Pending',
        data: [20, 18, 25, 15, 10],
        borderColor: '#764ba2',
      },
    ],
  };
}
