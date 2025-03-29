import { environment } from './../../../../environment/environment';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';
@Component({
  selector: 'app-employee-details-outstanding',
  templateUrl: './employee-details-outstanding.component.html',
  styleUrls: ['./employee-details-outstanding.component.css'],
})
export class EmployeeDetailsOutstandingComponent {
  employeeId: any = null;
  employeeData: any;
  showLoader: boolean = false;
  showAllDetails = false;
  outstandingtestlist: any[] = [];
  selectedDate: string = '';
  baseImageURL = environment.baseUrl;
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;
  searchText: FormControl = new FormControl();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private notificationService: NotificationService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.employeeId = params.get('id');
    });
    this.getOneEmployee();
    this.searchText.valueChanges.subscribe(() => {
      this.getOutstandingTestLists();
    })
  }

  openDatePicker(input: HTMLInputElement) {
    input.showPicker(); // Opens native date picker
  }

  onDateChange(date: string, subPolicyId: string) {
    const payload = {
      subPolicyId: subPolicyId,
      employeeId: this.employeeId,
      dueDate: date
    }
    this.spinner.show();
    this.employeeService.dueDateSetting(payload).subscribe(
      (response) => {
        this.spinner.hide();
        this.getOutstandingTestLists();
      },
      (error) => {
        this.spinner.hide();
        this.notificationService.showError(error?.error?.message || 'Something went wrong!');
      }
    );
  }

  getOneEmployee() {
    this.spinner.show();
    this.employeeService.getOneEmployee(this.employeeId).subscribe(
      (response) => {
        this.spinner.hide();
        this.employeeData = response?.data;
        this.getOutstandingTestLists();
      },
      (error) => {
        this.spinner.hide();
        this.notificationService.showError(error?.error?.message || 'Something went wrong!');
      }
    );
  }

  gotoCompletedPage() {
    this.router.navigateByUrl(`/admin/employee-details-completed/${this.employeeId}`);
  }

  toggleDetails() {
    this.showAllDetails = !this.showAllDetails;
  }

  getOutstandingTestLists() {
    let param = {
      employeeId: this.employeeId,
      pageNumber: 1,
      isFrontEndRequest : 1,
      pageLimit: this.pagesize,
      searchText: this.searchText.value,
      userGroup :this.employeeData?.role == 'EMPLOYEE' ? "1" : "2"
    }
    this.spinner.show();
    this.employeeService.getOutstandingTestList(param).subscribe(
      (response) => {
        this.spinner.hide();
        this.outstandingtestlist = response?.data?.policyList;
        // response?.data?.subPolicyList?.map((element: any) => {
        //   if (element?.conditionDetail?.length > 0 && element?.policyDetail?.[0]?.[0]?.policyType == 'For Information') {

        //   } else {
        //     if (element?.policySettingDetails?.[0]?.publishDate && new Date(element.policySettingDetails[0].publishDate) <= new Date()) {
        //       this.outstandingtestlist.push(element);
        //     }
        //   }
        // })
        // this.outstandingtestlist = this.outstandingtestlist.filter((element) => element?.policySettingDetails?.length > 0);
        this.totalRecords = response?.data?.count;
      },
      (error) => {
        this.spinner.hide();
        this.notificationService.showError(
          error?.error?.message || 'Something went wrong!'
        );
      }
    );
  }

  paginate(page: number) {
    this.page = page;
    this.getOutstandingTestLists();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
