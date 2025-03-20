import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QUESTION_TYPE } from 'src/app/common/enum/question-type.enum';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SubPoliciesService } from 'src/app/services/sub-policy/sub-policies.service';
import Swal from 'sweetalert2';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';


@Component({
  selector: 'app-show-exam-questions',
  templateUrl: './show-exam-questions.component.html',
  styleUrls: ['./show-exam-questions.component.css']
})
export class ShowExamQuestionsComponent {
  resultId: string | null = null;
  questions: any[] = [];
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private subPoliciesService: SubPoliciesService,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.resultId = params.get('id');
      this.getQuestionList();

    });
  }

  paginate(page: number) {
    this.page = page;
    this.getQuestionList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getQuestionList() {
    const payload = {
      resultId: this.resultId,
      pageNumber: this.page,
      pageLimit: this.pagesize,
    };
    this.questions = [];
    this.subPoliciesService.getTestQuestionList(payload).subscribe(
      (response) => {
        if (response?.data) {
          this.questions = response?.data?.answerList || [];
          this.totalRecords = response?.data?.count || 0;
          console.log(this.totalRecords);

        } else {
          this.questions = [];
        }
      },
      (error) => {
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

  getOptionLabel(index: number): string {
    const labels = ['a', 'b', 'c', 'd']; // Define static labels
    return labels[index] || String.fromCharCode(97 + index); // Fallback for more options
  }
}
