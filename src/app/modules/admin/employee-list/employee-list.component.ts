import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent {
  employees: any[] = [];
  showLoader: boolean = false;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private employeeService: EmployeeService
  ) {}
  ngOnInit() {
    this.getEmployees();
  }
  getEmployees() {
    this.showLoader = true;
    this.employeeService.getEmployee().subscribe(
      (response) => {
        console.log('this sis employee', response);
        this.showLoader = false;
        this.employees = response?.data;
        this.notificationService.showSuccess(
          response?.message || 'Get Employee successfully'
        );
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

  deleteEmployee(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!',
    }).then((result: any) => {
      if (result?.value) {
        this.showLoader = true;
        this.employeeService.deleteEmployee(id).subscribe(
          (response) => {
            this.showLoader = false;
            this.notificationService.showSuccess(
              response?.message || 'Delete Employee successfully'
            );
            this.getEmployees();
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
    });
  }
}
