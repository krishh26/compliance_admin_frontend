import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-outstanding',
  templateUrl: './outstanding.component.html',
  styleUrls: ['./outstanding.component.css']
})
export class OutstandingComponent {
  outstandingtestlist: any[] = [];
  showLoader: boolean = false;
  loginUser: any = [];

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private employeeService: EmployeeService,
    private localStorageService: LocalStorageService,
    private spinner: NgxSpinnerService
  ) {
    this.loginUser = this.localStorageService.getLogger();
  }

  ngOnInit() {
    this.getOutstandingTestLists();
  }

  getOutstandingTestLists() {
    let param = {
      employeeId: this.loginUser._id
    }
    this.spinner.show();
    this.employeeService.getOutstandingTestList(param).subscribe(
      (response) => {
        console.log('this sis employee', response);
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
        this.outstandingtestlist = response?.data;
        // this.notificationService.showSuccess(
        //   response?.message || 'Get Employee successfully'
        // );
      },
      (error) => {
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
        console.log('this is error', error);
        this.notificationService.showError(
          error?.error?.message || 'Something went wrong!'
        );
      }
    );
  }

}
