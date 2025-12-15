import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectTasklistComponent } from './project-tasklist';

describe('ProjectTasklistComponent', () => {
  let component: ProjectTasklistComponent;
  let fixture: ComponentFixture<ProjectTasklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectTasklistComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Tasks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
