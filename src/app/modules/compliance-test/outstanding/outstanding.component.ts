import { AfterViewInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-outstanding',
  templateUrl: './outstanding.component.html',
  styleUrls: ['./outstanding.component.css']
})
export class OutstandingComponent implements AfterViewInit {
  outstandingtestlist: any[] = [];
  showLoader: boolean = false;
  loginUser: any = [];
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;
  searchText: FormControl = new FormControl();

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private employeeService: EmployeeService,
    private localStorageService: LocalStorageService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
  ) {
    this.loginUser = this.localStorageService.getLogger();
  }

  ngAfterViewInit() {
    // Initialize all tooltips globally in this component
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  showTooltip(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const tooltipInstance = bootstrap.Tooltip.getInstance(target) || new bootstrap.Tooltip(target);

    // Show tooltip on click
    tooltipInstance.show();
  }

  ngOnInit() {
    this.getOutstandingTestLists();
    this.searchText.valueChanges.subscribe(() => {
      this.getOutstandingTestLists();
    })
  }

  paginate(page: number) {
    this.page = page;
    this.getOutstandingTestLists();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getOutstandingTestLists() {
    let param = {
      employeeId: this.loginUser._id,
      pageNumber: 1,
      pageLimit: this.pagesize,
      searchText: this.searchText.value,
      isFrontEndRequest: 1,
      userGroup: this.loginUser?.role == 'EMPLOYEE' ? "1" : "2"
    }
    this.spinner.show();
    this.outstandingtestlist = [];
    this.employeeService.getOutstandingTestList(param).subscribe(
      (response) => {
        this.spinner.hide();
        // this.outstandingtestlist = response?.data?.policyList;

        response?.data?.policyList?.map((element : any) => {
          if(Number(element?.subPoliciyDetail?.[0]?.policySettingDetail?.maximumAttempt) > element?.subPoliciyDetail?.[0]?.resultDetails?.length) {
            this.outstandingtestlist.push(element);
          }
        })

        // response?.data?.policyList?.map((element: any) => {
        //   if (element?.conditionDetail?.length > 0 && element?.policyDetail?.[0]?.[0]?.policyType == 'For Information') {

        //   } else {
        //     if (element?.policySettingDetails?.[0]?.publishDate && new Date(element.policySettingDetails[0].publishDate) <= new Date()) {
        //       this.outstandingtestlist.push(element);
        //     }
        //   }
        // })

        // this.outstandingtestlist = this.outstandingtestlist.filter((element) => element?.policySettingDetails?.length > 0);
        this.totalRecords = response?.data?.count || 0;
      },
      (error) => {
        this.spinner.hide();
        this.notificationService.showError(error?.error?.message || 'Something went wrong!');
      }
    );
  }

  dayLeft(resultDetails: any[], reAttemptDays: any, maximumAttempt: any) {
    resultDetails.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const latestResult = resultDetails[0];

    const dueDateObj = new Date(latestResult?.createdAt);
    dueDateObj.setDate(dueDateObj.getDate() + reAttemptDays);

    const today = new Date();
    const remainingDays = Math.ceil((dueDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return remainingDays > 0 ? `${remainingDays} days left` : "ReExam";
  }
}
