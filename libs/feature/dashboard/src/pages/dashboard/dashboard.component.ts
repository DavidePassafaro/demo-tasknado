import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  OnDestroy,
  Injector,
} from '@angular/core';
import { Router } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TasksService, ProjectsService } from '@shared/data-access';
import { TaskCardComponent } from '@shared/ui';
import { Task } from '@shared/models';
import {
  Subject,
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  takeUntil,
  shareReplay,
  tap,
} from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

interface TaskStatistics {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
  completionRate: number;
  averageTasksPerDay: number;
}

@Component({
  selector: 'tn-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [ScrollingModule, TaskCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private tasksService = inject(TasksService);
  private projectsService = inject(ProjectsService);
  private injector = inject(Injector);

  protected isLoading = signal(false);
  protected error = signal<string | null>(null);

  // Filter signals
  protected searchTerm = signal('');
  protected statusFilter = signal<string>('');
  protected sortBy = signal<'date' | 'title' | 'status'>('date');
  protected sortOrder = signal<'asc' | 'desc'>('desc');

  // RxJS Subjects for reactive filtering
  private searchTerm$ = new BehaviorSubject<string>('');
  private statusFilter$ = new BehaviorSubject<string>('');
  private sortBy$ = new BehaviorSubject<'date' | 'title' | 'status'>('date');
  private sortOrder$ = new BehaviorSubject<'asc' | 'desc'>('desc');
  private destroy$ = new Subject<void>();

  // Base tasks signal
  protected tasks = signal<Task[]>([]);

  /**
   * Advanced RxJS filtering pipeline
   * Combines multiple filter streams with debounce, distinctUntilChanged,
   * and custom mapping logic
   */
  protected filteredAndSortedTasks$ = combineLatest({
    tasks: toObservable(this.tasks, { injector: this.injector }),
    search: this.searchTerm$.pipe(
      debounceTime(300), // Debounce search input
      distinctUntilChanged() // Only emit if value changed
    ),
    status: this.statusFilter$.pipe(startWith('')),
    sortBy: this.sortBy$.pipe(startWith('date')),
    sortOrder: this.sortOrder$.pipe(startWith('desc')),
  }).pipe(
    // Map the combined values to filtered and sorted tasks
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
    shareReplay(1) // Share result among subscribers
  );

  /**
   * Advanced statistics pipeline
   * Aggregates real-time data from tasks
   */
  protected taskStatistics$ = this.filteredAndSortedTasks$.pipe(
    map((tasks) => {
      const stats: TaskStatistics = {
        total: tasks.length,
        completed: tasks.filter((t) => t.status === 'completed').length,
        inProgress: tasks.filter((t) => t.status === 'in_progress').length,
        todo: tasks.filter((t) => t.status === 'todo').length,
        completionRate:
          tasks.length > 0
            ? Math.round(
                (tasks.filter((t) => t.status === 'completed').length / tasks.length) * 100
              )
            : 0,
        averageTasksPerDay: this.calculateAverageTasksPerDay(tasks),
      };

      return stats;
    }),
    shareReplay(1)
  );

  // Signal wrapper for template binding
  protected filteredTasks = signal<Task[]>([]);
  protected statistics = signal<TaskStatistics>({
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0,
    completionRate: 0,
    averageTasksPerDay: 0,
  });

  ngOnInit(): void {
    this.loadUserTasks();

    // Subscribe to filtered tasks observable and update signal
    this.filteredAndSortedTasks$.pipe(takeUntil(this.destroy$)).subscribe((tasks) => {
      this.filteredTasks.set(tasks);
    });

    // Subscribe to statistics observable and update signal
    this.taskStatistics$.pipe(takeUntil(this.destroy$)).subscribe((stats) => {
      this.statistics.set(stats);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Loads all tasks for the current user
   */
  private loadUserTasks(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.projectsService
      .getProjectsTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tasks) => {
          this.isLoading.set(false);
          this.tasks.set(tasks);
        },
        error: (err: unknown) => {
          this.isLoading.set(false);
          this.error.set('Failed to load tasks. Please try again.');
          console.error('Error loading tasks:', err);
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
    this.searchTerm$.next(term);
  }

  /**
   * Update status filter
   * @param status Status to filter by
   */
  protected onStatusFilterChange(status: string): void {
    this.statusFilter.set(status);
    this.statusFilter$.next(status);
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
    this.sortBy$.next(validSortBy);
    this.sortOrder$.next(sortOrder);
  }

  /**
   * Reset all filters
   */
  protected resetFilters(): void {
    this.searchTerm.set('');
    this.statusFilter.set('');
    this.sortBy.set('date');
    this.sortOrder.set('desc');

    this.searchTerm$.next('');
    this.statusFilter$.next('');
    this.sortBy$.next('date');
    this.sortOrder$.next('desc');
  }

  /**
   * Navigates to the project that contains the task
   * @param task The task to navigate to
   */
  protected goToProject(task: Task): void {
    if (task.projectId) {
      this.router.navigate(['/projects', task.projectId, 'task', task.id]);
    }
  }

  /**
   * Handles task selected from task card
   * @param task The selected task
   */
  protected onTaskSelected(task: Task): void {
    if (task.projectId) {
      this.router.navigate(['/projects', task.projectId, 'task', task.id]);
    }
  }

  /**
   * Toggles the completion status of a task
   * @param id The ID of the task to toggle
   */
  protected toggleTask(id: number): void {
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
   * Deletes a task after confirmation
   * @param id The ID of the task to delete
   */
  protected deleteTask(id: number): void {
    this.tasksService.deleteTask(id);
  }

  /**
   * Gets the CSS class for task status
   * @param status The task status
   * @returns The CSS class name
   */
  protected getStatusClass(status: string): string {
    return `status-${status}`;
  }

  /**
   * Track by function for virtual scroll optimization
   * @param index The index of the task
   * @param task The task object
   * @returns The task ID for tracking
   */
  protected trackByTaskId(index: number, task: Task): number {
    return task.id;
  }
}
