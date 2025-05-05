import { environment } from './../../../../environment/environment';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime } from 'rxjs';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-details-outstanding',
  templateUrl: './employee-details-outstanding.component.html',
  styleUrls: ['./employee-details-outstanding.component.css'],
})
export class EmployeeDetailsOutstandingComponent implements OnInit {
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
  showData: boolean = false;
  activeDateInput: HTMLInputElement | null = null;
  bulkDueDate: string = '';

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
    this.searchText.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.getOutstandingTestLists();
    })
  }

  openDatePicker(dateInput: HTMLInputElement) {
    this.activeDateInput = dateInput;
    dateInput.showPicker();

    // Close the date picker when clicking outside
    const closeDatePicker = (event: MouseEvent) => {
      if (!dateInput.contains(event.target as Node)) {
        this.activeDateInput = null;
        document.removeEventListener('click', closeDatePicker);
      }
    };

    // Add click listener after a small delay to prevent immediate closing
    setTimeout(() => {
      document.addEventListener('click', closeDatePicker);
    }, 100);
  }

  onDateChange(date: string, subPolicyId: string) {
    if (!date) {
      this.notificationService.showError('Please select a date');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update the due date for this sub-policy ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          subPolicyId: subPolicyId,
          employeeId: this.employeeId,
          dueDate: date
        }
        this.spinner.show();
        this.employeeService.dueDateSetting(payload).subscribe(
          (response) => {
            this.spinner.hide();
            this.notificationService.showSuccess('Due date updated successfully');
            this.getOutstandingTestLists();
          },
          (error) => {
            this.spinner.hide();
            this.notificationService.showError(error?.error?.message || 'Something went wrong!');
          }
        );
      } else {
        // Reset the date if user cancels
        this.getOutstandingTestLists();
      }
    });
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
      isFrontEndRequest: 1,
      pageLimit: this.pagesize,
      searchText: this.searchText.value,
      userGroup: this.employeeData?.role == 'EMPLOYEE' ? "1" : "2"
    }
    this.spinner.show();
    this.outstandingtestlist = [];
    this.showData = false;
    this.employeeService.getOutstandingTestList(param).subscribe(
      (response) => {
        const forInfoList = response?.data?.policyList?.filter((element: any) => element?.policyType == 'For Information')
        // this.outstandingtestlist = response?.data?.policyList;


        response?.data?.policyList?.map((element: any) => {
          if (Number(element?.subPoliciyDetail?.[0]?.policySettingDetail?.maximumAttempt) > element?.subPoliciyDetail?.[0]?.resultDetails?.length) {
            if (element?.policyType == 'For Action') {
              const data = element?.subPoliciyDetail?.find((el: any) => el?._id == element?.subPoliciyList?._id);
              if (data?.resultDetails?.length !== 0 || data?.resultDetails) {
                this.outstandingtestlist.push(element);
              }
            }
          }
        });

        this.outstandingtestlist?.map((element) => {
          if (element?.policyType == 'For Action') {
            const filterSubPolicyData: any[] = element?.subPoliciyDetail?.find((data: any) => data?._id == element?.subPoliciyList?._id && data?.resultDetails?.length == 0);

            element['subPoliciyDetail'] = element?.subPoliciyDetail?.filter((data: any) => data?.resultDetails?.length !== 0) || [];

            if (filterSubPolicyData) {
              element['subPoliciyDetail']?.push(filterSubPolicyData);
            }
          }
        })

        for (const data of this.outstandingtestlist || []) {
          const tempData: any[] = [];
          data?.subPoliciyDetail?.map((element: any) => {
            if (tempData?.length == 0 && element?.questions?.length >= element?.policySettingDetail?.maximumQuestions) {
              tempData?.push(element);
            } else {
              const existingData = tempData?.find((details) => details?._id == element?._id);
              if (!existingData && element?.questions?.length >= element?.policySettingDetail?.maximumQuestions) {
                tempData?.push(element);
              }
            }
            data['subPoliciyDetail'] = tempData;
          });
        }

        this.outstandingtestlist = this.splitPolicies(this.outstandingtestlist);

        for (const data of this.outstandingtestlist || []) {
          setTimeout(async () => {
            try {
              const resultDetails = await this.getResultSubPolicyWise(data?.subPoliciyDetail?.[0]?._id);
              data.subPoliciyDetail[0]['resultCount'] = resultDetails;
            } catch (error) {
            }
          }, 300);
        }

        setTimeout(() => {
          this.outstandingtestlist = this.outstandingtestlist?.filter((element) => element?.subPoliciyDetail[0]?.resultCount < element?.subPoliciyDetail[0]?.policySettingDetail?.maximumAttempt);
          this.spinner.hide();
          forInfoList?.map((element: any) => {
            if (element?.policyType == 'For Information') {
              const data = element?.subPoliciyDetail?.find((el: any) => el?._id == element?.subPoliciyList?._id);
              if ((data?.conditionDetail?.length == 0 || !data?.conditionDetail)) {
                this.outstandingtestlist.push(element);
              }
            }
          });
          this.showData = true;
        }, 1000);

        this.totalRecords = response?.data?.count || 0;
      },
      (error) => {
        this.spinner.hide();
        this.notificationService.showError(error?.error?.message || 'Something went wrong!');
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
      if (policy?.policyType == 'For Action') {
        if (policy.subPoliciyDetail.length > 1) {
          const data = policy?.subPoliciyDetail?.filter((el: any) => el?._id == policy?.subPoliciyList?._id);
          if (data?.length !== 0) {
            policy["subPoliciyDetail"] = data;
            policy.subPoliciyDetail.forEach((detail: any) => {
              result.push({
                ...policy,
                subPoliciyDetail: [detail],
              });
            });
          }
        } else {
          result.push(policy);
        }
      }
    });

    return result;
  }

  paginate(page: number) {
    this.page = page;
    this.getOutstandingTestLists();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  dueDateCheck(dueDate: any): boolean {
    const currentDate = new Date(); // Get the current date
    const inputDate = new Date(dueDate); // Convert the dueDate to a Date object
    // Set time to 00:00:00 for both dates to compare only the date part
    currentDate.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    return inputDate < currentDate; // Return true if dueDate is greater than current date
  }

  applyBulkDateChange() {
    if (!this.bulkDueDate) {
      this.notificationService.showError('Please select a date first');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'This will update the due date for all outstanding sub-policies. Do you want to continue?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update all!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();

        // Create an array of promises for all API calls
        const updatePromises = this.outstandingtestlist.map(item => {
          const payload = {
            subPolicyId: item?.subPoliciyDetail?.[0]?._id,
            employeeId: this.employeeId,
            dueDate: this.bulkDueDate
          };

          return new Promise((resolve, reject) => {
            this.employeeService.dueDateSetting(payload).subscribe(
              (response) => resolve(response),
              (error) => reject(error)
            );
          });
        });

        // Execute all API calls in parallel
        Promise.all(updatePromises)
          .then(() => {
            this.spinner.hide();
            this.notificationService.showSuccess('Due dates updated successfully');
            this.bulkDueDate = ''; // Reset the bulk date
            this.getOutstandingTestLists(); // Refresh the list
          })
          .catch((error) => {
            this.spinner.hide();
            this.notificationService.showError(error?.error?.message || 'Something went wrong while updating dates');
          });
      }
    });
  }
}
