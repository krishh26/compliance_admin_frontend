import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { PolicyService } from 'src/app/services/policy/policy.service';
import { SubPoliciesService } from 'src/app/services/sub-policy/sub-policies.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';
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
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;
  policyDetails: any;
  loginUser: any;

  constructor(
    private notificationService: NotificationService,
    private subPoliciesService: SubPoliciesService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private policyService: PolicyService,
    private localStorageService: LocalStorageService
  ) {
    this.loginUser = this.localStorageService.getLogger();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.policyId = params.get('id');
      if (this.policyId) {
        this.getPolicyDetails();
        this.getSubPolicyList();
      }
    });
  }

  paginate(page: number) {
    this.page = page;
    this.getSubPolicyList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getPolicyDetails() {
    this.policyService.getPolicyDetails(this.policyId).subscribe((response) => {
      if (response?.statusCode == 200 || response?.statusCode == 201) {
        this.policyDetails = response?.data;
      }
    }, (error) => {
      setTimeout(() => { this.spinner.hide(); }, 1000);
      this.notificationService.showError(error?.error?.message || 'Something went wrong!');
    })
  }

  getSubPolicyList() {
    this.spinner.show();
    this.policyList = [];
    this.subPoliciesService
      .getSubPolicyList({
        policyId: this.policyId,
        isActive: 1,
        isFrontEndRequest: 1,
        employeeId : this.loginUser?._id
      })
      .subscribe(
        (response) => {
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
          this.policyList = response?.data?.subPolicyList || [];
          this.totalRecords = response?.data?.count || 0;
        },
        (error) => {
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
          this.notificationService.showError(
            error?.error?.message || 'Something went wrong!'
          );
        }
      );
  }

  uploadSubPolicies() {
    this.router.navigate(['/sub-policies/upload-sub-policy', this.policyId]);
  }

  deleteSubPolicy(id: any) {
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
        const payload = { id: id };
        this.subPoliciesService.deleteSubPolicy(payload).subscribe(
          (response) => {
            setTimeout(() => {
              this.spinner.hide();
            }, 1000);
            this.notificationService.showSuccess(
              'Delete Sub Policy successfully'
            );
            this.getSubPolicyList();
          },
          (error) => {
            setTimeout(() => {
              this.spinner.hide();
            }, 1000);
            this.notificationService.showError(
              error?.error?.message || 'Something went wrong!'
            );
          }
        );
      }
    });
  }
}
