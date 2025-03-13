import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';

@Component({
  selector: 'app-completed-test',
  templateUrl: './completed-test.component.html',
  styleUrls: ['./completed-test.component.css']
})
export class CompletedTestComponent {
  completedtestlist: any[] = [];
  showLoader: boolean = false;
  loginUser: any = [];
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;

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
    this.getCompletedTestLists();
  }

  paginate(page: number) {
    this.page = page;
    this.getCompletedTestLists();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getFormattedDuration(duration: number): string {
    return duration % 1 === 0 ? duration.toString() : duration.toFixed(2);
  }

  getCompletedTestLists() {
    let param = {
      employeeId: this.loginUser._id
    }
    this.spinner.show();
    this.employeeService.getCompletedTestList(param).subscribe(
      (response) => {
        this.spinner.hide();
        this.completedtestlist = response?.data?.subPolicyList;
        this.completedtestlist = this.completedtestlist.map((policy) => {
          let sortedResults = policy.resultDetails.sort(
            (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          // Extract the latest result
          const latestResult = sortedResults.length ? sortedResults[0] : null;
          this.totalRecords = response?.data?.count || 0;
          return {
            ...policy,
            latestResult,  // Set the latest result in the root object
            resultDetails: sortedResults  // Keep sorted result details
          };
        });
      },
      (error) => {
        this.spinner.hide();
        this.notificationService.showError(error?.error?.message || 'Something went wrong!');
      }
    );
  }

}
