import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SubPoliciesService } from 'src/app/services/sub-policy/sub-policies.service';

@Component({
  selector: 'app-sub-policy-outstanding',
  templateUrl: './sub-policy-outstanding.component.html',
  styleUrls: ['./sub-policy-outstanding.component.css']
})
export class SubPolicyOutstandingComponent {
  subPolicyId: any = null;
  countDetails: any;
  outStandingList: any[] = [];
  dataType: string = 'EMPLOYEE';
  subPolicyDetails: any;
  settingDetails: any;

  constructor(
    private notificationService: NotificationService,
    private subPoliciesService: SubPoliciesService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.subPolicyId = params.get('id');
      if (this.subPolicyId) {
        this.getSubPolicyDetails();
        this.getPolicySettingDetails();
        this.getSubPolicyCountAndData();
      }
    });
  }


  getPolicySettingDetails() {
    this.subPoliciesService.getPolicySetting({ subPolicyId: this.subPolicyId }).subscribe((response) => {
      if (response?.statusCode == 200) {
        this.settingDetails = response?.data || {};
      } else {
        this.notificationService.showError(response?.message || 'Policy instructions not found.');
      }
    }, (error) => {
      this.notificationService.showError(error?.error?.message || 'Policy instructions not found.');
    })
  }

  getSubPolicyDetails() {
    this.spinner.show();
    this.subPoliciesService.getSubPolicyDetails({ id: this.subPolicyId }).subscribe((response) => {
      setTimeout(() => { this.spinner.hide(); }, 1000);
      this.subPolicyDetails = response?.data || {};
    }, (error) => {
      setTimeout(() => { this.spinner.hide(); }, 1000);
      this.notificationService.showError(error?.error?.message || 'Something went wrong!');
    });
  }

  getSubPolicyCountAndData() {
    this.spinner.show();
    this.subPoliciesService.getSubPolicyCountAndData({ subPolicyId: this.subPolicyId }).subscribe((response) => {
      setTimeout(() => { this.spinner.hide(); }, 1000);
      this.countDetails = response?.data;
      this.outStandingList = this.countDetails?.empOutStadingList || [];
      console.log(this.countDetails)
    }, (error) => {
      setTimeout(() => { this.spinner.hide(); }, 1000);
      this.notificationService.showError(error?.error?.message || 'Something went wrong!');
    });
  }

  changeType(type: string) {
    this.dataType = type;
    if (type == 'LINE_MANAGER') {
      this.outStandingList = this.countDetails?.lineManagerOutStadinglist || [];
    } else {
      this.outStandingList = this.countDetails?.empOutStadingList || [];
    }
  }
}
