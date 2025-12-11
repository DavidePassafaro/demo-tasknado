import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrimaryButtonComponent } from './primary-button.component';

describe('PrimaryButtonComponent', () => {
  let component: PrimaryButtonComponent;
  let fixture: ComponentFixture<PrimaryButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimaryButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrimaryButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit clicked event when button is clicked', () => {
    spyOn(component.clicked, 'emit');
    component.onButtonClick();
    expect(component.clicked.emit).toHaveBeenCalled();
  });

  it('should render button with label', () => {
    fixture.componentRef.setInput('label', 'Click me');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.textContent).toBe('Click me');
  });

  it('should disable button when disabled input is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBe(true);
  });

  it('should set button type correctly', () => {
    fixture.componentRef.setInput('type', 'submit');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.type).toBe('submit');
  });
});
