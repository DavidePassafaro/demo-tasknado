import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimaryButtonComponent } from '@shared/ui';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'tn-home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
  imports: [CommonModule, PrimaryButtonComponent],
})
export class Home implements OnInit {
  features: Feature[] = [];

  ngOnInit() {
    this.features = [
      {
        icon: '📋',
        title: 'Task Management',
        description: 'Organize and track all your tasks in one place with priorities and deadlines'
      },
      {
        icon: '👥',
        title: 'Team Collaboration',
        description: 'Work together with your team in real time with assignments and comments'
      },
      {
        icon: '📊',
        title: 'Analytics & Reports',
        description: 'View progress with intuitive dashboards and detailed reports'
      },
      {
        icon: '📅',
        title: 'Timelines & Calendars',
        description: 'Plan your projects with timeline views and interactive calendars'
      },
      {
        icon: '🔔',
        title: 'Notifications & Reminders',
        description: 'Get instant notifications for deadlines and important updates'
      },
      {
        icon: '⚡',
        title: 'Automations',
        description: 'Automate workflows and save time on repetitive tasks'
      }
    ];
  }
}
