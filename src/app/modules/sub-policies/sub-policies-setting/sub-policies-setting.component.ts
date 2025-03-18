import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SubPoliciesService } from 'src/app/services/sub-policy/sub-policies.service';

@Component({
  selector: 'app-sub-policies-setting',
  templateUrl: './sub-policies-setting.component.html',
  styleUrls: ['./sub-policies-setting.component.css'],
})
export class SubPoliciesSettingComponent {
  testSettingsForm: FormGroup;
  submitted: boolean = false;
  subPolicyId!: any;
  showLoader: boolean = false;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private subPoliciesService: SubPoliciesService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
  ) {
    this.route.paramMap.subscribe((params) => {
      this.subPolicyId = String(params.get('id'));
      if (this.subPolicyId) {
        this.getSettingDetails();
      }
    });

    this.testSettingsForm = this.fb.group({
      examTimeLimit: ['', [Validators.required]],
      maximumRettemptDaysLeft: ['', [Validators.required]],
      maximumAttempt: ['', [Validators.required]],
      maximumMarks: ['', [Validators.required]],
      maximumQuestions: ['', [Validators.required]],
      maximumScore: [{ value: '', disabled: true }],
      timeLimit: ['', [Validators.required]],
      PassingScore: ['', [Validators.required]],
      publishDate: ['', [Validators.required]],
      skipWeekDays: [1, [Validators.required]],
    });

    this.testSettingsForm.get('maximumMarks')?.valueChanges.subscribe(() => this.calculateValues());
    this.testSettingsForm.get('maximumQuestions')?.valueChanges.subscribe(() => this.calculateValues());
  }

  get f() {
    return this.testSettingsForm.controls;
  }

  getSettingDetails() {
    this.subPoliciesService.getPolicySetting({ subPolicyId: this.subPolicyId }).subscribe((response) => {
      if (response?.data) {
        const formattedExamTimeLimit = response?.data?.examTimeLimit
          ? new Date(response?.data?.examTimeLimit).toISOString().split('T')[0]
          : '';
        const formattedPublish = response?.data?.publishDate
          ? new Date(response?.data?.publishDate)
            .toISOString()
            .split('T')[0]
          : '';

        this.testSettingsForm.patchValue({
          examTimeLimit: formattedExamTimeLimit,
          maximumRettemptDaysLeft: response?.data?.maximumRettemptDaysLeft,
          maximumAttempt: response?.data?.maximumAttempt,
          maximumMarks: response?.data?.maximumMarks,
          maximumQuestions: response?.data?.maximumQuestions,
          maximumScore: response?.data?.maximumScore,
          timeLimit: response?.data?.timeLimit,
          PassingScore: response?.data?.PassingScore,
          publishDate: formattedPublish,
          skipWeekDays: response?.data?.skipWeekDays,
        });
      } else {
        this.testSettingsForm.reset();
        this.testSettingsForm.patchValue({
          skipWeekDays: 1,
        });
      }
    }, (error) => {
      this.testSettingsForm.reset();
      this.testSettingsForm.patchValue({
        skipWeekDays: 1,
      });
    })
  }

  calculateValues(): void {
    const maxMarks = Number(this.testSettingsForm.get('maximumMarks')?.value) || 0;
    const maxQuestions = Number(this.testSettingsForm.get('maximumQuestions')?.value) || 1; // Avoid division by zero

    // Calculate passing marks and max score
    const passingMarks = Math.floor((maxMarks * 33) / 100);
    const maxScore = (maxMarks / maxQuestions).toFixed(2);

    // Set values in the form
    // this.testSettingsForm.patchValue({
    //   PassingScore: passingMarks,
    //   maximumScore: maxScore,
    // });

    this.testSettingsForm.patchValue({
      maximumScore: maxScore,
    });
  }

  back() {
    this.location.back();
  }

  onSubmit() {
    this.showLoader = true;
    this.submitted = true;
    if (!this.testSettingsForm.valid) {
      return;
    }
    const payload = { ...this.testSettingsForm.getRawValue(), subPolicyId: this.subPolicyId, dueDate: this.testSettingsForm.get('examTimeLimit')?.value };
    this.subPoliciesService.updatePolicySetting(payload).subscribe((response) => {
      this.notificationService.showSuccess(response?.message || 'Setting Updated Successfully.');
    }, (error) => {
      this.notificationService.showError(error?.error?.message || 'Something went wrong!');
    })
  }
}
