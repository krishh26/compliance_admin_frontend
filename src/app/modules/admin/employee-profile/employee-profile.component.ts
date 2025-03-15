import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent {
  loginUser: any;
  employeeData: any;

  constructor(
    private employeeService: EmployeeService,
    private notificationService: NotificationService,
    private localStorageService: LocalStorageService,
    private spinner: NgxSpinnerService
  ) {
    this.loginUser = this.localStorageService.getLogger();
  }

  ngOnInit() {
    this.getOneEmployee();
  }

  getOneEmployee() {
    this.spinner.show();
    this.employeeService.getOneEmployee(this.loginUser?._id).subscribe((response) => {
      this.employeeData = response?.data;
      setTimeout(() => { this.spinner.hide(); }, 1000);
    }, (error) => {
      setTimeout(() => { this.spinner.hide(); }, 1000);
      this.notificationService.showError(error?.error?.message || 'Something went wrong!');
    }
    );
  }
}
