import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubPolicyFailedComponent } from './sub-policy-failed.component';

describe('SubPolicyFailedComponent', () => {
  let component: SubPolicyFailedComponent;
  let fixture: ComponentFixture<SubPolicyFailedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubPolicyFailedComponent]
    });
    fixture = TestBed.createComponent(SubPolicyFailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
