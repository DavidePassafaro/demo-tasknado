import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TasksService, ProjectsService } from '@shared/data-access';
import { TaskCardComponent } from '@shared/ui';
import { Task } from '@shared/models';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  shareReplay,
  tap,
} from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

interface TaskStatistics {
  total: number;
  completed: number;
  inProgress: number;
  completionRate: number;
}

@Component({
  selector: 'tn-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [ScrollingModule, TaskCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private tasksService = inject(TasksService);
  private projectsService = inject(ProjectsService);

  protected isLoading = signal(false);
  protected error = signal<string | null>(null);

  // Base tasks signal
  protected tasks = signal<Task[]>([]);

  // Filter signals
  protected searchTerm = signal('');
  protected statusFilter = signal<string>('');
  protected sortBy = signal<'date' | 'title' | 'status'>('date');
  protected sortOrder = signal<'asc' | 'desc'>('desc');

  protected tasks$ = toObservable(this.tasks);
  protected searchTerm$ = toObservable(this.searchTerm);
  protected statusFilter$ = toObservable(this.statusFilter);
  protected sortBy$ = toObservable(this.sortBy);
  protected sortOrder$ = toObservable(this.sortOrder);

  protected filteredAndSortedTasks$ = combineLatest({
    tasks: this.tasks$,
    search: this.searchTerm$.pipe(debounceTime(300), distinctUntilChanged()),
    status: this.statusFilter$.pipe(startWith('')),
    sortBy: this.sortBy$.pipe(startWith('date')),
    sortOrder: this.sortOrder$.pipe(startWith('desc')),
  }).pipe(
    map(({ tasks, search, status, sortBy, sortOrder }) => {
      let filtered = [...tasks];

      // Apply search filter (case-insensitive)
      if (search.trim()) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(
          (task) =>
            task.title.toLowerCase().includes(searchLower) ||
            task.description?.toLowerCase().includes(searchLower)
        );
      }

      // Apply status filter
      if (status) {
        filtered = filtered.filter((task) => task.status === status);
      }

      // Apply sorting
      filtered.sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'status':
            comparison = a.status.localeCompare(b.status);
            break;
          case 'date':
          default:
            comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }

        return sortOrder === 'asc' ? comparison : -comparison;
      });

      return filtered;
    }),
    shareReplay(1)
  );

  /**
   * Advanced statistics pipeline
   * Aggregates real-time data from tasks
   */
  protected taskStatistics$ = this.filteredAndSortedTasks$.pipe(
    map((tasks) => {
      const completed = tasks.filter((t) => t.status === 'completed').length;

      const stats: TaskStatistics = {
        total: tasks.length,
        completed: completed,
        inProgress: tasks.filter((t) => t.status === 'todo').length,
        completionRate: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0,
      };

      return stats;
    }),
    shareReplay(1)
  );

  protected filteredTasks = toSignal(this.filteredAndSortedTasks$, { initialValue: [] });
  protected statistics = toSignal(this.taskStatistics$, {
    initialValue: {
      total: 0,
      completed: 0,
      inProgress: 0,
      completionRate: 0,
    },
  });

  ngOnInit(): void {
    this.loadUserTasks();
  }

  /**
   * Loads all tasks for the current user
   */
  private loadUserTasks(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.projectsService.getProjectsTasks().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
      },
      error: (err) => {
        this.error.set('Failed to load tasks. Please try again.');
        console.error('Error loading tasks:', err);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Calculate average tasks created per day
   * @param tasks Array of tasks
   * @returns Average number of tasks per day
   */
  private calculateAverageTasksPerDay(tasks: Task[]): number {
    if (tasks.length === 0) return 0;

    const dates = new Set(tasks.map((t) => new Date(t.createdAt).toDateString()));
    return parseFloat((tasks.length / dates.size).toFixed(2));
  }

  /**
   * Update search term with debounce
   * @param term Search term
   */
  protected onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }

  /**
   * Update status filter
   * @param status Status to filter by
   */
  protected onStatusFilterChange(status: string): void {
    this.statusFilter.set(status);
  }

  /**
   * Update sort options
   * @param sortBy Sort field
   * @param sortOrder Sort order
   */
  protected onSortChange(sortBy: string, sortOrder: 'asc' | 'desc'): void {
    const validSortBy = sortBy as 'date' | 'title' | 'status';
    this.sortBy.set(validSortBy);
    this.sortOrder.set(sortOrder);
  }

  /**
   * Reset all filters
   */
  protected resetFilters(): void {
    this.searchTerm.set('');
    this.statusFilter.set('');
    this.sortBy.set('date');
    this.sortOrder.set('desc');
  }

  /**
   * Toggles the completion status of a task
   * @param id The ID of the task to toggle
   */
  protected toggleTaskStatus(id: number): void {
    const task = this.tasks().find((t) => t.id === id);
    if (task) {
      const newStatus = task.status === 'completed' ? 'todo' : 'completed';
      this.tasksService
        .updateTask(id, { status: newStatus })
        .pipe(
          tap(() => {
            const updatedTasks = this.tasks().map((t) =>
              t.id === id ? { ...t, status: newStatus } : t
            );
            this.tasks.set(updatedTasks);
          })
        )
        .subscribe();
    }
  }

  /**
   * Handles task selected from task card
   * @param task The selected task
   */
  protected onTaskSelected(task: Task): void {
    this.router.navigate(['/projects', task.projectId, 'task', task.id]);
  }

  /**
   * Deletes a task after confirmation
   * @param id The ID of the task to delete
   */
  protected deleteTask(id: number): void {
    this.tasksService.deleteTask(id);
  }

  /**
   * Track by function for virtual scroll optimization
   * @param index The index of the task
   * @param task The task object
   * @returns The task ID for tracking
   */
  protected trackByTaskId(_: number, task: Task): number {
    return task.id;
  }
}
