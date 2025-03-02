import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-employee-details-outstanding',
  templateUrl: './employee-details-outstanding.component.html',
  styleUrls: ['./employee-details-outstanding.component.css'],
})
export class EmployeeDetailsOutstandingComponent {
  employeeId: string | null = null;
  employeeData: any;
  showLoader: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.employeeId = params.get('id');
      console.log('Employee ID:', this.employeeId);
    });
    this.getOneEmployee();
  }

  getOneEmployee() {
    this.showLoader = true;
    this.employeeService.getOneEmployee(this.employeeId).subscribe(
      (response) => {
        this.employeeData = response?.data;
      },
      (error) => {
        this.showLoader = false;
        console.log('this is error', error);
        this.notificationService.showError(
          error?.error?.message || 'Something went wrong!'
        );
      }
    );
  }
}
