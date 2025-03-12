import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SubPoliciesService } from 'src/app/services/sub-policy/sub-policies.service';

@Component({
  selector: 'app-exam-intruction',
  templateUrl: './exam-intruction.component.html',
  styleUrls: ['./exam-intruction.component.css']
})
export class ExamIntructionComponent {
  subPolicyId: any;
  showLoader: boolean = false;
  settingDetails: any = {};
  selectInstructions: any;

  constructor(
    private route: ActivatedRoute,
    private subPoliciesService: SubPoliciesService,
    private notificationService: NotificationService,
    private router : Router

  ) {
    this.route.paramMap.subscribe((params) => {
      this.subPolicyId = params.get('id');
      if (this.subPolicyId) {
        this.getPolicySettingDetails();
      }
    });
  }

  getPolicySettingDetails() {
    this.showLoader = true;
    this.subPoliciesService.getPolicySetting({ subPolicyId: this.subPolicyId }).subscribe((response) => {
      if (response?.statusCode == 200) {
        this.settingDetails = response?.data;
      } else {
        this.notificationService.showError(response?.message || 'Policy instructions not found.');
      }
      this.showLoader = false;
    }, (error) => {
      this.notificationService.showError(error?.error?.message || 'Policy instructions not found.');
      this.showLoader = false;
    })
  }

  startTest() {
    if (!this.selectInstructions) {
      return this.notificationService.showError("Please accept the declaration.");
    }
    this.router.navigate([`compliance-test/start-exam/${this.subPolicyId}`]);
  }
}
