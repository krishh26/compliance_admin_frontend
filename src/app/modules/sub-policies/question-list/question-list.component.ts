import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QUESTION_TYPE } from 'src/app/common/enum/question-type.enum';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SubPoliciesService } from 'src/app/services/sub-policy/sub-policies.service';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css'],
})
export class QuestionListComponent implements OnInit {
  subPolicyId: string | null = null;
  userGroup: string | null = null;
  showLoader: boolean = false;
  questions: any[] = [];

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private subPoliciesService: SubPoliciesService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.subPolicyId = params['subPoliciesId'];
      this.userGroup = params['userGroup'];

      if (this.subPolicyId && this.userGroup) {
        this.getQuestionList();
      }
    });
  }

  getQuestionList() {
    this.showLoader = true;
    const payload = {
      subPolicyId: this.subPolicyId,
      userGroup: this.userGroup,
      size: '1',
    };

    this.subPoliciesService.getQuestionList(payload).subscribe(
      (response) => {
        this.showLoader = false;
        if (response?.data) {
          this.questions = response.data.map((question: any) => ({
            id: question._id,
            questionText: question.questionText, // Corrected property name
            questionType: this.getAnswerType(question.questionType), // Mapped to readable type
            options:
              question.optionsDetails?.map(
                (option: any) => option.optionText
              ) || [],
          }));
        } else {
          this.questions = [];
        }
      },
      (error) => {
        this.showLoader = false;
        this.notificationService.showError(
          error?.error?.message || 'Something went wrong!'
        );
      }
    );
  }

  back() {
    this.location.back();
  }

  editQuestion(id: number) {
    console.log('Edit Question:', id);
  }

  deleteQuestion(id: number) {
    console.log('Delete Question:', id);
  }

  getAnswerType(questionType: string): string {
    switch (questionType) {
      case QUESTION_TYPE.CHECKBOX:
        return 'Multiple Choice';
      case QUESTION_TYPE.BOOLEAN:
        return 'boolean';
      case QUESTION_TYPE.MCQ:
        return 'MCQ';
      default:
        return 'Unknown';
    }
  }
}
