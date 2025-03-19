import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { PolicyService } from 'src/app/services/policy/policy.service';

@Component({
  selector: 'app-upload-policies',
  templateUrl: './upload-policies.component.html',
  styleUrls: ['./upload-policies.component.css']
})
export class UploadPoliciesComponent implements OnInit {
  policyForm: FormGroup;
  policyID!: any;
  showLoader: boolean = false;
  policyData: any;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private policyService: PolicyService
  ) {
    this.policyForm = this.fb.group({
      name: ['', Validators.required],
      version: ['0.0.0'],
      description: ['Test'],
      userGroup: ['1,2'],
      policyType: ['', Validators.required],
      status: ['Pending'],
    })
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.policyID = params.get('id');
      if (this.policyID) {
        this.getPolicyDetails();
      }
    });
  }

  getPolicyDetails() {
    this.showLoader = true;
    this.policyService.getPolicyDetails(this.policyID).subscribe((response) => {
      this.policyData = response?.data;
      if (this.policyData) {
        this.policyForm.patchValue({
          name: this.policyData.name,
          version: this.policyData.version,
          description: this.policyData.description,
          userGroup: this.policyData.userGroup,
          policyType: this.policyData.policyType,
          status: this.policyData.status
        });
      }
    }, (error) => {
      this.showLoader = false;
      this.notificationService.showError(error?.error?.message || 'Something went wrong!');
    }
    );
  }

  get f() {
    return this.policyForm.controls;
  }

  submitForm() {
    this.submitted = true;
    if (!this.policyForm.valid) {
      return;
    }
    if (this.policyID) {
      return this.update();
    }
    this.showLoader = true;

    this.policyService.createPolicy(this.policyForm.value).subscribe((response) => {
      this.showLoader = false;
      this.notificationService.showSuccess(response?.message || 'Policy Create successfully');
      this.router.navigate(['/policies/policies-list']);
    }, (error) => {
      this.showLoader = false;
      this.notificationService.showError(error?.error?.message || 'Something went wrong!');
    });
  }

  update() {
    this.submitted = true;
    if (!this.policyForm.valid) {
      return;
    }
    this.showLoader = true;

    this.policyService.updatePolicy(this.policyID, this.policyForm.value).subscribe((response) => {
      this.showLoader = false;
      this.notificationService.showSuccess(response?.message || 'Policy updated successfully');
      this.router.navigate(['/policies/policies-list']);
    }, (error) => {
      this.showLoader = false;
      this.notificationService.showError(error?.error?.message || 'Something went wrong!');
    });
  }
}
