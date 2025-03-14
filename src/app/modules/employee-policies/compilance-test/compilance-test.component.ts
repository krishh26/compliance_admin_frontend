import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { PolicyService } from 'src/app/services/policy/policy.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-compilance-test',
  templateUrl: './compilance-test.component.html',
  styleUrls: ['./compilance-test.component.css'],
})
export class CompilanceTestComponent {
  policyList: any[] = [];
  showLoader: boolean = false;

  constructor(
    private notificationService: NotificationService,
    private policyService: PolicyService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.getPolicyList();
  }

  getPolicyList() {
    this.spinner.show();
    this.policyList = [];
    this.policyService.getPolicyList().subscribe(
      (response) => {
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
        this.policyList = response?.data || [];

      },
      (error) => {
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
        console.log('this is error', error);
        this.notificationService.showError(
          error?.error?.message || 'Something went wrong!'
        );
      }
    );
  }

  deletePolicy(id: any) {
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
        this.spinner.show();
        this.policyService.deletePolicy(id).subscribe(
          (response) => {
            setTimeout(() => {
              this.spinner.hide();
            }, 1000);
            this.notificationService.showSuccess('Delete Policy successfully');
            this.getPolicyList();
          },
          (error) => {
            setTimeout(() => {
              this.spinner.hide();
            }, 1000);
            console.log('this is error', error);
            this.notificationService.showError(
              error?.error?.message || 'Something went wrong!'
            );
          }
        );
      }
    });
  }
}
