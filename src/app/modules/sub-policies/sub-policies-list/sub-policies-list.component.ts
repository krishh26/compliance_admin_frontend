import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SubPoliciesService } from 'src/app/services/sub-policy/sub-policies.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sub-policies-list',
  templateUrl: './sub-policies-list.component.html',
  styleUrls: ['./sub-policies-list.component.css'],
})
export class SubPoliciesListComponent {
  policyList: any[] = [];
  showLoader: boolean = false;
  policyId: any = null;
  latestPolicy: any;
  countDetails: any;

  constructor(
    private notificationService: NotificationService,
    private subPoliciesService: SubPoliciesService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.policyId = params.get('id');
      this.getPolicyList();
    });
  }

  getPolicyList() {
    this.spinner.show();
    this.policyList = [];
    this.subPoliciesService.getSubPolicyList({ policyId: this.policyId }).subscribe((response) => {
      setTimeout(() => { this.spinner.hide(); }, 2000);
      this.policyList = response?.data || [];
      const sortedPolicies = response?.data?.sort(
        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      this.latestPolicy = sortedPolicies?.[0];
      if (this.latestPolicy) {
        this.getSubPolicyCountAndData();
      }
    }, (error) => {
      setTimeout(() => { this.spinner.hide(); }, 2000);
      this.notificationService.showError(error?.error?.message || 'Something went wrong!');
    });
  }

  uploadSubPolicies() {
    this.router.navigate(['/sub-policies/upload-sub-policy', this.policyId]);
  }

  deleteSubPolicy(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete sub policy ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4285F4',
      cancelButtonColor: '#C8C8C8',
      confirmButtonText: 'Yes, Delete!',
    }).then((result: any) => {
      if (result?.value) {
        this.showLoader = true;
        const payload = { id: id };
        this.subPoliciesService.deleteSubPolicy(payload).subscribe(
          (response) => {
            this.showLoader = false;
            this.notificationService.showSuccess('Delete Sub Policy successfully');
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

  getSubPolicyCountAndData() {
    this.spinner.show();
    this.subPoliciesService.getSubPolicyCountAndData({ subPolicyId: this.latestPolicy?._id }).subscribe((response) => {
      setTimeout(() => { this.spinner.hide(); }, 1000);
      this.countDetails = response?.data;
    }, (error) => {
      setTimeout(() => { this.spinner.hide(); }, 1000);
      this.notificationService.showError(error?.error?.message || 'Something went wrong!');
    });
  }

}
