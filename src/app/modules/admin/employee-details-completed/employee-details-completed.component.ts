import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { environment } from './../../../../environment/environment';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-employee-details-completed',
  templateUrl: './employee-details-completed.component.html',
  styleUrls: ['./employee-details-completed.component.css']
})
export class EmployeeDetailsCompletedComponent {
  employeeId: any = null;
  employeeData: any;
  showLoader: boolean = false;
  showAllDetails = false;
  completedTestList: any[] = [];
  baseImageURL = environment.baseUrl;
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;
  searchText: FormControl = new FormControl();
  sortby: FormControl = new FormControl();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.employeeId = params.get('id');
    });
    this.getOneEmployee();
    // this.searchText.valueChanges.subscribe(() => {
    //   this.getCompletedTestLists();
    // })
  }

  searchData() {
    this.getCompletedTestLists();
  }

  toggleDetails() {
    this.showAllDetails = !this.showAllDetails;
  }

  getOneEmployee() {
    this.showLoader = true;
    this.employeeService.getOneEmployee(this.employeeId).subscribe((response) => {
      this.employeeData = response?.data;
      this.getCompletedTestLists();
    }, (error) => {
      this.showLoader = false;
      this.notificationService.showError(error?.error?.message || 'Something went wrong!');
    }
    );
  }

  convertDecimalMinutesToMinSec(decimalMinutes: number): string {
    const totalSeconds = Math.round(decimalMinutes * 60);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const minPart = minutes > 0 ? `${minutes} Min` : '';
    const secPart = seconds > 0 ? `${seconds} Sec` : '';

    return `${minPart} ${secPart}`.trim();
  }

  calculateDaysDifference(passedDateString: string): string | number {
    const passedDate = new Date(passedDateString);
    const currentDate = new Date();

    // Normalize time for comparison (set to 00:00:00)
    passedDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    if (currentDate > passedDate) {
      return '';
    } else {
      const timeDiff = passedDate.getTime() - currentDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return daysDiff;
    }
  }

  getCompletedTestLists() {
    let param = {
      employeeId: this.employeeId,
      pageNumber: this.page,
      pageLimit: this.pagesize,
      searchText: this.searchText.value,
      sortBy: this.sortby.value || '_id',
      sortOrder: 'desc'
    }
    this.showLoader = true;
    this.employeeService.getCompletedTestList(param).subscribe((response) => {
      this.showLoader = false;
      this.completedTestList = response?.data?.subPolicyList || [];
      this.completedTestList = this.completedTestList?.map((policy) => {
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
    }, (error) => {
      this.showLoader = false;
      this.notificationService.showError(error?.error?.message || 'Something went wrong!');
    }
    );
  }

  gotoOutStandingPage() {
    this.router.navigateByUrl(`/admin/employee-details-outstanding/${this.employeeId}`);
  }

  paginate(page: number) {
    this.page = page;
    this.getCompletedTestLists();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
