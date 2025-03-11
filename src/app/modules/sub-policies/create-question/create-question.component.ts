import { Location } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SubPoliciesService } from 'src/app/services/sub-policy/sub-policies.service';

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.css'],
})
export class CreateQuestionComponent {
  questionForm!: FormGroup;
  questionTypes = [
    {
      name: "MCQ",
      value: "3"
    },
    {
      name: "Boolean",
      value: "2"
    },
    {
      name: 'Multiple Choice',
      value: "1"
    }
  ]

  showLoader: boolean = false;
  subPolicyId: string | null = null;
  userGroup: string | null = null;
  constructor(
    private fb: FormBuilder,
    private location: Location,
    private subPoliciesService: SubPoliciesService,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.subPolicyId = params['subPoliciesId'];
      this.userGroup = params['userGroup'];
    });
  }

  initializeForm() {
    this.questionForm = this.fb.group({
      questions: this.fb.array([]),
    });

    this.addNewQuestion(); // Start with one question
  }

  get questions() {
    return this.questionForm.get('questions') as FormArray;
  }

  getOptions(questionIndex: number) {
    return this.questions.at(questionIndex).get('options') as FormArray;
  }

  addNewQuestion() {
    const newQuestion = this.fb.group({
      questionText: ['', Validators.required],
      questionType: ['MCQ', Validators.required],
      options: this.fb.array([]),
      isActive: ['1', Validators.required],
      answer: ['', Validators.required],
    });

    this.questions.push(newQuestion);
    this.setDefaultOptions(this.questions.length - 1);
  }

  setDefaultOptions(questionIndex: number) {
    const type = this.questions.at(questionIndex).get('questionType')?.value;
    const optionsArray = this.getOptions(questionIndex);
    optionsArray.clear();

    if (type === "3") {
      // MCQ: Always 4 fixed options
      for (let i = 1; i <= 4; i++) {
        optionsArray.push(new FormControl(`Option ${i}`, Validators.required));
      }
    } else if (type === "2") {
      // Boolean: Always Yes & No
      ['True', 'false'].forEach((option) =>
        optionsArray.push(new FormControl(option, Validators.required))
      );
    } else if (type === '1') {
      // Multiple Choice: Starts with 4 options, but can add more
      for (let i = 1; i <= 4; i++) {
        optionsArray.push(new FormControl(`Option ${i}`, Validators.required));
      }
    }
  }

  addOption(questionIndex: number) {
    if (this.isMultipleChoice(questionIndex)) {
      this.getOptions(questionIndex).push(
        new FormControl('', Validators.required)
      );
    }
  }

  removeOption(questionIndex: number, optionIndex: number) {
    if (
      this.isMultipleChoice(questionIndex) &&
      this.getOptions(questionIndex).length > 4
    ) {
      this.getOptions(questionIndex).removeAt(optionIndex);
    }
  }

  onTypeChange(questionIndex: number) {
    this.setDefaultOptions(questionIndex);
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  getAnswerList(index: number) {
    return this.questions.at(index).get('options')?.value;
  }
  submitForm(): void {
    if (this.questionForm.invalid) {
      this.questionForm.markAllAsTouched(); // Show errors
      return;
    }
    this.showLoader = true;
    const payload = {
      ...this.questionForm.value,
      subPolicyId: this.subPolicyId,
      userGroup: this.userGroup,
    };

    const newPayload = this.formatePayload(payload);

    this.subPoliciesService.createQuestion(payload).subscribe(
      (response) => {
        this.showLoader = false;

        this.notificationService.showSuccess(
          response?.message || 'Questions Create successfully'
        );
      },
      (error) => {
        this.showLoader = false;
        this.notificationService.showError(
          error?.error?.message || 'Something went wrong!'
        );
      }
    );
  }

  formatePayload(payload: any) {
    payload?.questions?.forEach((element: any) => {
      if (element?.options?.length > 0) {
        const optionList: any[] = [];
        element.options.forEach((option: any, index: number) => {
          const data = {
            index: index,
            value: option
          }
          optionList.push(data);
        });

        element.options = optionList;
      }
    });

    return payload;
  }

  isMultipleChoice(index: number): boolean {
    return (
      this.questions.at(index).get('questionType')?.value === 'Multiple Choice'
    );
  }

  back() {
    this.location.back();
  }
}
