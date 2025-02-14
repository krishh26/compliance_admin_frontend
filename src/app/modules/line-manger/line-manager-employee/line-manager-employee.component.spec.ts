import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineManagerEmployeeComponent } from './line-manager-employee.component';

describe('LineManagerEmployeeComponent', () => {
  let component: LineManagerEmployeeComponent;
  let fixture: ComponentFixture<LineManagerEmployeeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LineManagerEmployeeComponent]
    });
    fixture = TestBed.createComponent(LineManagerEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
