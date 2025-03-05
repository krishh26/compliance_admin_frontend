import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { PolicyService } from 'src/app/services/policy/policy.service';
import { SubPoliciesService } from 'src/app/services/sub-policy/sub-policies.service';

@Component({
  selector: 'app-upload-sub-policies',
  templateUrl: './upload-sub-policies.component.html',
  styleUrls: ['./upload-sub-policies.component.css'],
})
export class UploadSubPoliciesComponent {
  policyForm: FormGroup;
  policyID!: any;
  showLoader: boolean = false;
  policyData: any;
  submitted: boolean = false;
  policyList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notificationService: NotificationService,
    private subPoliciesService: SubPoliciesService,
    private route: ActivatedRoute,
    private location: Location,
    private policyService: PolicyService
  ) {
    this.policyForm = this.fb.group({
      policyId: ['', Validators.required],
      name: ['', Validators.required],
      version: ['', Validators.required],
      description: [''],
      isActive: [1],
    });
  }
  get f() {
    return this.policyForm.controls;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.policyID = params.get('id');
    });
    this.getPolicyList();
  }

  back() {
    this.location.back();
  }

  getPolicyList() {
    this.showLoader = true;
    this.policyList = [];
    this.policyService.getPolicyList().subscribe(
      (response) => {
        this.showLoader = false;
        this.policyList = response?.data || [];
        console.log('this is my policies services', this.policyList);
        // this.notificationService.showSuccess(response?.message || 'Get Policy successfully');
      },
      (error) => {
        this.showLoader = false;
        // this.notificationService.showError(error?.error?.message || 'Something went wrong!');
      }
    );
  }

  submitForm() {
    this.submitted = true;
    if (!this.policyForm.valid) {
      return;
    }
    this.showLoader = true;
    this.subPoliciesService.createPolicy(this.policyForm.value).subscribe(
      (response) => {
        this.showLoader = false;

        this.notificationService.showSuccess(
          response?.message || 'Sub Policy Create successfully'
        );

        this.router.navigate([
          '/sub-policies/sub-policies-list',
          this.policyID,
        ]);
      },
      (error) => {
        this.showLoader = false;
        this.notificationService.showError(
          error?.error?.message || 'Something went wrong!'
        );
      }
    );
  }
}
