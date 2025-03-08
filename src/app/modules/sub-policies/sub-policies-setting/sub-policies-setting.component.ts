import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sub-policies-setting',
  templateUrl: './sub-policies-setting.component.html',
  styleUrls: ['./sub-policies-setting.component.css'],
})
export class SubPoliciesSettingComponent {
  testSettingsForm: FormGroup;
  submitted: boolean = false;

  constructor(private fb: FormBuilder, private location: Location) {
    this.testSettingsForm = this.fb.group({
      examTimeline: ['', [Validators.required]],
      reattemptDaysLeft: ['', [Validators.required]],
      maxReattempts: ['', [Validators.required]],
      maxMarks: ['', [Validators.required]],
      maxQuestions: ['', [Validators.required]],
      maxScore: [{ value: '', disabled: true }],
      timeLimit: ['', [Validators.required]],
      publishDate: ['', [Validators.required]],
      passingMarks: [{ value: '', disabled: true }],
    });

    this.testSettingsForm
      .get('maxMarks')
      ?.valueChanges.subscribe(() => this.calculateValues());
    this.testSettingsForm
      .get('maxQuestions')
      ?.valueChanges.subscribe(() => this.calculateValues());
  }

  get f() {
    return this.testSettingsForm.controls;
  }

  calculateValues(): void {
    const maxMarks = Number(this.testSettingsForm.get('maxMarks')?.value) || 0;
    const maxQuestions =
      Number(this.testSettingsForm.get('maxQuestions')?.value) || 1; // Avoid division by zero

    // Calculate passing marks and max score
    const passingMarks = Math.floor((maxMarks * 33) / 100);
    const maxScore = (maxMarks / maxQuestions).toFixed(2);

    // Set values in the form
    this.testSettingsForm.patchValue({
      passingMarks: passingMarks,
      maxScore: maxScore,
    });
  }
  back() {
    this.location.back();
  }
  onSubmit() {
    this.submitted = true;
    if (!this.testSettingsForm.valid) {
      return;
    }
    const payload = { ...this.testSettingsForm.getRawValue() };
    console.log('Form Submitted', payload);
  }
}
