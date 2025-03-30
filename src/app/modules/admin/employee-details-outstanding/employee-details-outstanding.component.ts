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

        // this.outstandingtestlist = response?.data?.policyList;

        response?.data?.policyList?.map((element: any) => {
          if (Number(element?.subPoliciyDetail?.[0]?.policySettingDetail?.maximumAttempt) > element?.subPoliciyDetail?.[0]?.resultDetails?.length) {
            this.outstandingtestlist.push(element);
          }
        });

        this.outstandingtestlist?.map((element) => {
          const filterSubPolicyData: any[] = element?.subPoliciyDetail?.filter((data: any) => data?.resultDetails?.length == 0);

          element['subPoliciyDetail'] = element?.subPoliciyDetail?.filter((data: any) => data?.resultDetails?.length !== 0) || [];

          if (filterSubPolicyData?.length > 0) {
            filterSubPolicyData.sort(
              (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            element['subPoliciyDetail']?.push(filterSubPolicyData[0]);
          }
        })


        this.outstandingtestlist = this.splitPolicies(this.outstandingtestlist);

        for (const data of this.outstandingtestlist || []) {
          setTimeout(async () => {
            try {
              const resultDetails = await this.getResultSubPolicyWise(data?.subPoliciyDetail?.[0]?._id);
              data.subPoliciyDetail[0]['resultCount'] = resultDetails;
            } catch (error) {
            }
          }, 500);
        }

        setTimeout(() => {
          this.outstandingtestlist = this.outstandingtestlist?.filter((element) => element?.subPoliciyDetail[0]?.resultCount < element?.subPoliciyDetail[0]?.policySettingDetail?.maximumAttempt);
          this.spinner.hide();
        }, 2000);

        this.totalRecords = response?.data?.count || 0;
      },
      (error) => {
        this.spinner.hide();
        this.notificationService.showError(
          error?.error?.message || 'Something went wrong!'
        );
      }
    );
  }

  async getResultSubPolicyWise(subPolicyId: string): Promise<number> {
    const payload = {
      employeeId: this.employeeId,
      subPolicyId: subPolicyId
    };

    return new Promise((resolve, reject) => {
      this.employeeService.getResultBasedOnSubPolicy(payload).subscribe(
        (response) => {
          const count = response?.data?.resultList?.length || 0;
          resolve(count); // Return the count properly
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  splitPolicies(policies: any[]): any[] {
    const result: any[] = [];

    policies.forEach(policy => {
      if (policy.subPoliciyDetail.length > 1) {
        policy.subPoliciyDetail.forEach((detail: any) => {
          result.push({
            ...policy,
            subPoliciyDetail: [detail],
          });
        });
      } else {
        result.push(policy);
      }
    });

    return result;
  }

  paginate(page: number) {
    this.page = page;
    this.getOutstandingTestLists();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
