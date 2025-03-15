import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QUESTION_TYPE } from 'src/app/common/enum/question-type.enum';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SubPoliciesService } from 'src/app/services/sub-policy/sub-policies.service';
import Swal from 'sweetalert2';
import { BulyEntryQuestionComponent } from '../buly-entry-question/buly-entry-question.component';

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
    private subPoliciesService: SubPoliciesService,
    private router: Router,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.subPolicyId = params['subPoliciesId'];
      this.userGroup = params['userGroup'];

      if (this.subPolicyId && this.userGroup) {
        this.getQuestionList();
      }
    });
  }

  openAddTeamModal() {
    this.modalService.open(BulyEntryQuestionComponent, { size: 'l' });
  }

  getQuestionList() {
    this.showLoader = true;
    const payload = {
      subPolicyId: this.subPolicyId,
      userGroup: this.userGroup,
    };

    this.subPoliciesService.getQuestionList(payload).subscribe(
      (response) => {
        this.showLoader = false;
        if (response?.data) {
          this.questions = response?.data?.questionList?.map((question: any) => ({
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
        this.questions = [];
        if (error?.status !== 404) {
          this.notificationService.showError(
            error?.error?.message || 'Something went wrong!'
          );
        }
      }
    );
  }

  back() {
    this.location.back();
  }

  editQuestion(id: number) {
    this.router.navigate(['/sub-policies/edit-question'], {
      queryParams: {
        questionId: id,
        userGroup: this.userGroup,
      },
    });
  }

  deleteQuestion(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete this Question ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4285F4',
      cancelButtonColor: '#C8C8C8',
      confirmButtonText: 'Yes, Delete!',
    }).then((result: any) => {
      if (result?.value) {
        this.showLoader = true;
        const payload = { id: id };
        console.log('this is payload', payload);
        this.subPoliciesService.deleteQuestion(payload).subscribe(
          (response) => {
            this.showLoader = false;
            this.notificationService.showSuccess(
              'Delete Question successfully'
            );
            this.getQuestionList();
          },
          (error) => {
            this.showLoader = false;
            console.log('this is error', error);
            this.notificationService.showError(
              error?.error?.message || 'Something went wrong!'
            );
          }
        );
      }
    });
  }

  getAnswerType(questionType: string): string {
    switch (questionType) {
      case QUESTION_TYPE.CHECKBOX:
        return 'Multiple Choice';
      case QUESTION_TYPE.BOOLEAN:
        return 'Boolean';
      case QUESTION_TYPE.MCQ:
        return 'MCQ';
      default:
        return 'Unknown';
    }
  }

  createQuestion() {
    this.router.navigate(['/sub-policies/create-question'], {
      queryParams: {
        subPoliciesId: this.subPolicyId,
        userGroup: this.userGroup,
      },
    });
  }

  getOptionLabel(index: number): string {
    const labels = ['a', 'b', 'c', 'd']; // Define static labels
    return labels[index] || String.fromCharCode(97 + index); // Fallback for more options
  }
}
