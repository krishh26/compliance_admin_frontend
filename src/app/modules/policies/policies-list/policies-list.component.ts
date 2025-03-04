import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { PolicyService } from 'src/app/services/policy/policy.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-policies-list',
  templateUrl: './policies-list.component.html',
  styleUrls: ['./policies-list.component.css'],
})
export class PoliciesListComponent implements OnInit {
  policyList: any[] = [];
  showLoader: boolean = false;

  constructor(
    private notificationService: NotificationService,
    private policyService: PolicyService
  ) {}

  ngOnInit(): void {
    this.getPolicyList();
  }

  getPolicyList() {
    this.showLoader = true;
    this.policyList = [];
    this.policyService.getPolicyList().subscribe(
      (response) => {
        this.showLoader = false;
        this.policyList = response?.data || [];
        // this.notificationService.showSuccess(response?.message || 'Get Policy successfully');
      },
      (error) => {
        this.showLoader = false;
        // this.notificationService.showError(error?.error?.message || 'Something went wrong!');
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
        this.showLoader = true;
        this.policyService.deletePolicy(id).subscribe(
          (response) => {
            this.showLoader = false;
            this.notificationService.showSuccess('Delete Policy successfully');
            this.getPolicyList();
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
}
