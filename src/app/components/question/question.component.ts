import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, QuizApiQuestion } from 'src/app/shared/services/api.service';
import { QuizresultService } from 'src/app/shared/services/quizresult.service';

@Component({
  selector: 'app-question',
  standalone: false,
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class QuestionComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private quizresult: QuizresultService,
    private cdr: ChangeDetectorRef
  ) {}
  questions: QuizApiQuestion[] = [];
  questionCount = 0;
  category = '';
  difficulty = '';
  quizTitle = '';
  quizId = '';
  currentPage: any = 1;
  isAnswerCorrect: any;
  showResult: any;
  selectOption: any;
  showSubmitQuizButton: any;
  showSubmitAnswerButton: any;
  isLoading: boolean = false;
  errorMessage = '';

  get currentQuestion(): any {
    return this.questions[this.currentPage - 1];
  }

  ngOnInit(): void {
    this.quizId = this.route.snapshot.paramMap.get('quizId') ?? '';
    this.getQuizzes();
  }

  getQuizzes() {
    this.isLoading = true;
    this.errorMessage = '';
    this.apiService
      .getQuizQuestions(this.quizId).subscribe((result) => {
        this.questions = result;
        this.questions = this.questions.map((question: any, index: any) => {
          const questionNo = index + 1;
          return { ...question, questionNo };
        });
        this.questionCount = this.questions.length;
        if (this.questions.length) {
          this.quizTitle = this.questions[0].quizTitle;
          this.category = this.questions[0].category;
          this.difficulty = this.questions[0].difficulty;
        }
        if (!this.questionCount) {
          this.errorMessage = 'No questions are currently available for this quiz.';
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      }, () => {
        this.errorMessage = 'Unable to load questions from QuizAPI right now.';
        this.isLoading = false;
        this.cdr.detectChanges();
      });
  }
  submitQuiz() {
    this.quizresult.getQuestionsData(this.questions);
    this.router.navigate(['result']);
  }

  goToQuizBrowser() {
    this.router.navigate(['quiz']);
  }

  nextQuestion(value: any) {
    this.currentPage += 1;
    this.showResult = false;
    this.isAnswerCorrect = false;
    this.selectOption = false;
  }
  submitAnswer(value: any) {
    const selectedAnswer = this.currentQuestion.answers.find(
      (answer: any) => answer.id === value.option
    );

    if (!selectedAnswer) {
      this.selectOption = true;
      return;
    }

    if (selectedAnswer.isCorrect) {
      this.isAnswerCorrect = true;
      this.showResult = true;
      this.selectOption = false;
    } else {
      this.showResult = true;
      this.isAnswerCorrect = false;
      this.selectOption = false;
      this.currentQuestion.isSolvedWrong = true;
    }
    if (this.currentPage >= this.questions.length) {
      this.showSubmitQuizButton = true;
    }
  }
}
