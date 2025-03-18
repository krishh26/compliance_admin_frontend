import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SubPoliciesService } from 'src/app/services/sub-policy/sub-policies.service';

@Component({
  selector: 'app-terms-condition-admin',
  templateUrl: './terms-condition-admin.component.html',
  styleUrls: ['./terms-condition-admin.component.css']
})
export class TermsConditionAdminComponent {
  subPolicyID!: string;
  subPolicyData!: any;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private subPoliciesService: SubPoliciesService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.route.paramMap.subscribe((params) => {
      this.subPolicyID = String(params.get('id'));
      if(this.subPolicyID) {
        this.getSubPolicyDetails();
      }
    });
  }

  getSubPolicyDetails() {
    this.spinner.show();
    this.subPoliciesService.getPolicyDetails(this.subPolicyID).subscribe((response) => {
      this.subPolicyData = response?.data;
      setTimeout(() => {
        this.spinner.hide();
      }, 1000);
    }, (error) => {
      setTimeout(() => {
        this.spinner.hide();
      }, 1000);
      this.notificationService.showError(error?.error?.message || 'Something went wrong!');
    }
    );
  }
}
