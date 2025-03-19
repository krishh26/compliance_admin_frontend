import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import Swal from 'sweetalert2';
import { BulkEntryEmployeeComponent } from '../bulk-entry-employee/bulk-entry-employee.component';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent {
  employees: any[] = [];
  showLoader: boolean = false;
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;
  searchText: FormControl = new FormControl();

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private employeeService: EmployeeService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.getEmployees();
    this.searchText.valueChanges.subscribe(() => {
      this.getEmployees();
    })
  }

  paginate(page: number) {
    this.page = page;
    this.getEmployees();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getEmployees() {
    this.spinner.show();

    const params = {
      pageNumber: this.page,
      pageLimit: this.pagesize,
      searchText: this.searchText.value
    };

    this.employeeService.getEmployee(params).subscribe(
      (response) => {
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);

        this.employees = response?.data?.employeeList;

        // Ensure totalRecords is updated
        this.totalRecords = response?.data?.count || 0;
      },
      (error) => {
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
        console.log('This is error', error);
        this.notificationService.showError(
          error?.error?.message || 'Something went wrong!'
        );
      }
    );
  }


  openAddTeamModal() {
    this.modalService.open(BulkEntryEmployeeComponent, { size: 'l' });
  }

  deleteEmployee(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!',
    }).then((result: any) => {
      if (result?.value) {
        this.showLoader = true;
        this.employeeService.deleteEmployee(id).subscribe(
          (response) => {
            this.showLoader = false;
            this.notificationService.showSuccess(
              response?.message || 'Delete Employee successfully'
            );
            this.getEmployees();
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
    });
  }

  onToggleSwitch(employee: any) {
    const payload = {
      id: employee._id,
      isActive: employee.isActive ? 1 : 0 // Ensuring correct format for API
    };

    this.spinner.show();
    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));

    this.employeeService.updateEmp(formData).subscribe(
      (response) => {
        this.spinner.hide();
        this.notificationService.showSuccess(response?.message || 'Employee updated successfully');
        this.getEmployees();
       // this.router.navigate(['/admin/employee-details-outstanding', employee._id]);
      },
      (error) => {
        this.spinner.hide();
        this.notificationService.showError(error?.error?.message || 'Something went wrong!');
      }
    );
  }

}
