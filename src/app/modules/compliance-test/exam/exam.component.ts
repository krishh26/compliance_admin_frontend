import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SubPoliciesService } from 'src/app/services/sub-policy/sub-policies.service';


@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent {
  subPolicyId: any;
  showLoader: boolean = false;
  settingDetails: any = {};
  selectInstructions: any;
  loginUser: any;
  questions: any[] = []; // Question list
  currentQuestionIndex: number = 0;
  answers: any[] = [];
  timeLeft: number = 600; // 10 minutes in seconds
  timerInterval: any;

  constructor(
    private route: ActivatedRoute,
    private subPoliciesService: SubPoliciesService,
    private notificationService: NotificationService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.loginUser = this.localStorageService.getLogger();
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
        const savedTime = localStorage.getItem('timeLeft');
        this.timeLeft = savedTime ? parseInt(savedTime) : this.settingDetails?.timeLimit * 60;
        this.loadQuestions();
      } else {
        this.notificationService.showError(response?.message || 'Policy instructions not found.');
      }
      this.showLoader = false;
    }, (error) => {
      this.notificationService.showError(error?.error?.message || 'Policy instructions not found.');
      this.showLoader = false;
    })
  }

  getQuestionList() {
    this.showLoader = true;
    const payload = {
      subPolicyId: this.subPolicyId,
      isActive: 1,
      userGroup: this.loginUser.role == "LINEMANAGER" ? "2" : "1",
      size: Number(this.settingDetails?.maximumQuestions) || 0
    }
    this.subPoliciesService.getQuestionList(payload).subscribe((response) => {
      if (response?.statusCode == 200 || response?.statusCode == 201) {
        this.questions = response?.data?.questionList;
        if (this.questions?.[0] == null) {
          return this.notificationService.showError('Questions not found.');
        }
        localStorage.setItem('questions', JSON.stringify(this.questions));
      } else {
        this.notificationService.showError('Questions not found.');
      }
      this.showLoader = false;
    }, (error) => {
      this.notificationService.showError(error?.error?.message || 'Questions not found.');
      this.showLoader = false;
    })
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
  }


  ngOnInit() {
    this.loadAnswers();
    this.startTimer();
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        localStorage.setItem('timeLeft', this.timeLeft.toString());
      } else {
        this.completeExam();
      }
    }, 1000);
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  loadQuestions() {
    this.questions = JSON.parse(localStorage.getItem('questions')!) || []; // Load from localStorage or API
    if (this.questions?.length == 0) {
      this.getQuestionList();
    }
  }

  loadAnswers() {
    this.answers = JSON.parse(localStorage.getItem('answers')!) || [];
  }

  get currentQuestion() {
    return this.questions[this.currentQuestionIndex];
  }

  selectAnswer(optionIndex: number) {
    const questionId = this.currentQuestion._id;
    const existingAnswer = this.answers.find((a) => a.questionId === questionId);

    if (this.currentQuestion.questionType == '1') {
      // Multiple choice (checkbox)
      if (!existingAnswer) {
        this.answers.push({ questionId, answer: [optionIndex] });
      } else {
        const index = existingAnswer.answer.indexOf(optionIndex);
        if (index > -1) {
          existingAnswer.answer.splice(index, 1);
        } else {
          existingAnswer.answer.push(optionIndex);
        }
      }
    } else {
      // Single choice (radio)
      if (existingAnswer) {
        existingAnswer.answer = optionIndex;
      } else {
        this.answers.push({ questionId, answer: optionIndex });
      }
    }

    localStorage.setItem('answers', JSON.stringify(this.answers));
  }

  isOptionSelected(optionIndex: number): boolean {
    this.loadAnswers();
    const existingAnswer = this.answers.find((a) => a.questionId === this.currentQuestion._id);
    return existingAnswer?.answer?.includes?.(optionIndex) || existingAnswer?.answer === optionIndex;
  }

  nextQuestion() {
    this.loadAnswers();
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  completeExam() {
    this.showLoader = true;
    const transformedArray = this.answers.map(item => ({
      questionId: item.questionId,
      answer: Array.isArray(item.answer) ? item.answer.join(",") : item.answer.toString()
    }));

    const duration = (Number(localStorage.getItem('timeLeft')) !== 0 && localStorage.getItem('timeLeft')) ? (Number(localStorage.getItem('timeLeft')) / 60) : 1;

    clearInterval(this.timerInterval);
    const payload = {
      subPolicyId: this.subPolicyId,
      userGroup: this.loginUser.role == "LINEMANAGER" ? "2" : "1",
      passingScore: this.settingDetails?.PassingScore,
      marksPerQuestion: this.settingDetails?.maximumScore,
      duration: duration !== 0 ? duration : this.settingDetails?.timeLimit,
      answers: transformedArray
    }

    this.subPoliciesService.saveAnswer(payload).subscribe((response) => {
      if (response?.statusCode == 200 || response?.statusCode == 201) {
        localStorage.removeItem('answers');
        localStorage.removeItem('questions');
        localStorage.removeItem('timeLeft');
        this.notificationService.showSuccess('Test result submitted.');
        this.router.navigateByUrl('/compliance-test/outstanding');
      } else {
        this.notificationService.showError(response?.message || 'Something went wrong !');
      }
      this.showLoader = false;
    }, (error) => {
      this.notificationService.showError(error?.error?.message || 'Something went wrong !');
      this.showLoader = false;
    });
  }

  get progressPercent(): number {
    return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
  }

  resetLocal() {
    localStorage.removeItem('answers');
    localStorage.removeItem('questions');
    localStorage.removeItem('timeLeft');
  }
}
