import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-completed-test',
  templateUrl: './completed-test.component.html',
  styleUrls: ['./completed-test.component.css']
})
export class CompletedTestComponent {
  completedtestlist: any[] = [];
  showLoader: boolean = false;
  loginUser: any = [];

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private employeeService: EmployeeService,
    private localStorageService: LocalStorageService
  ) {
    this.loginUser = this.localStorageService.getLogger();
  }

  ngOnInit() {
    this.getCompletedTestLists();
  }

  getCompletedTestLists() {
    let param = {
      employeeId: this.loginUser._id
    }
    this.showLoader = true;
    this.employeeService.getCompletedTestList(param).subscribe(
      (response) => {
        console.log('this sis employee', response);
        this.showLoader = false;
        this.completedtestlist = response?.data;
        this.completedtestlist = this.completedtestlist.map((policy) => {
          let sortedResults = policy.resultDetails.sort(
            (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          // Extract the latest result
          const latestResult = sortedResults.length ? sortedResults[0] : null;

          return {
            ...policy,
            latestResult,  // Set the latest result in the root object
            resultDetails: sortedResults  // Keep sorted result details
          };
        });

        console.log("this.completedtestlist", this.completedtestlist);
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
