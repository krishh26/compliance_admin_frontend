import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';

@Component({
  selector: 'app-outstanding',
  templateUrl: './outstanding.component.html',
  styleUrls: ['./outstanding.component.css']
})
export class OutstandingComponent {
  outstandingtestlist: any[] = [];
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
    this.getOutstandingTestLists();
  }

  paginate(page: number) {
    this.page = page;
    this.getOutstandingTestLists();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getOutstandingTestLists() {
    let param = {
      employeeId: this.loginUser._id
    }
    this.spinner.show();
    this.employeeService.getOutstandingTestList(param).subscribe(
      (response) => {
        this.spinner.hide();
        this.outstandingtestlist = response?.data?.subPolicyList;
        this.outstandingtestlist = this.outstandingtestlist.filter((element) => element?.policySettingDetails?.length > 0);
        this.totalRecords = response?.data?.count || 0;
      },
      (error) => {
        this.spinner.hide();
        this.notificationService.showError(error?.error?.message || 'Something went wrong!');
      }
    );
  }

}
