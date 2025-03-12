import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-employee-details-completed',
  templateUrl: './employee-details-completed.component.html',
  styleUrls: ['./employee-details-completed.component.css']
})
export class EmployeeDetailsCompletedComponent {
  employeeId: any = null;
  employeeData: any;
  showLoader: boolean = false;
  showAllDetails = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.employeeId = params.get('id');
    });
    this.getOneEmployee();
  }

  toggleDetails() {
    this.showAllDetails = !this.showAllDetails;
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

  gotoOutStandingPage() {
    this.router.navigateByUrl(`/admin/employee-details-outstanding/${this.employeeId}`);
  }
}
