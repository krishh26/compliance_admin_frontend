import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
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
    this.employeeService.dueDateSetting(payload).subscribe(
      (response) => {
        setTimeout(() => {
          this.spinner.hide();
        }, 2000);
        this.getOutstandingTestLists();
      },
      (error) => {
        this.spinner.hide();
        this.notificationService.showError(error?.error?.message || 'Something went wrong!');
      }
    );
  }

  getOneEmployee() {
    this.showLoader = true;
    this.employeeService.getOneEmployee(this.employeeId).subscribe(
      (response) => {
        this.employeeData = response?.data;
        this.getOutstandingTestLists();
      },
      (error) => {
        this.showLoader = false;
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
      employeeId: this.employeeId
    }
    this.spinner.show();
    this.employeeService.getOutstandingTestList(param).subscribe(
      (response) => {
        this.spinner.hide();
        this.outstandingtestlist = response?.data?.subPolicyList;
        this.outstandingtestlist = this.outstandingtestlist.filter((element) => element?.policySettingDetails?.length > 0);
      },
      (error) => {
        this.spinner.hide();
        this.notificationService.showError(
          error?.error?.message || 'Something went wrong!'
        );
      }
    );
  }
}
