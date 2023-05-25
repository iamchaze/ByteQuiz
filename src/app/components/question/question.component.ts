import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { QuizresultService } from 'src/app/shared/services/quizresult.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class QuestionComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: GlobalService,
    private apiService: ApiService,
    private quizresult: QuizresultService
  ) {}
  questions: any = [];
  questionCount: any;
  answers: any = [];
  options: any = [];
  category: any;
  difficulty: any;
  questionNo: any;
  currentPage: any = 1;
  isAnswerCorrect: any;
  showResult: any;
  selectOption: any;
  showSubmitQuizButton: any;
  showSubmitAnswerButton: any;

  ngOnInit(): void {
    this.category = this.route.snapshot.paramMap.get('category');
    this.difficulty = this.route.snapshot.paramMap.get('difficulty');
    this.getQuizzes();
  }
  getQuizzes() {
    this.apiService
      .getQuizzes(this.category, this.difficulty).subscribe((result) => {
        this.questions = result;
        this.questions = this.questions.map((question: any, index: any) => {
          const questionNo = index + 1;
          return { ...question, questionNo };
        });

        this.questions.forEach((question: any) => {
          question.correct_answer = question.answers[question.correct_answer];
          question.answers = Object.values(question.answers);
          question.correct_answers = Object.values(question.correct_answers);
        });
        console.log(this.questions);
        this.questionCount = this.questions.length;
      });
  }
  submitQuiz() {
    this.quizresult.getQuestionsData(this.questions);
    this.router.navigate(['result']);
  }
  nextQuestion(value: any) {
    this.currentPage += 1;
    this.showResult = false;
    this.isAnswerCorrect = false;
  }
  submitAnswer(value: any) {
    const index = this.questions[this.currentPage - 1].answers.indexOf(
      value.option
    );
    if (this.questions.correct_answer === value.option) {
      this.isAnswerCorrect = true;
      this.showResult = true;
      this.selectOption = false;
    } else {
      if (
        this.questions[this.currentPage - 1].correct_answers[index] === 'true'
      ) {
        this.isAnswerCorrect = true;
        this.showResult = true;
        this.selectOption = false;
      } else if (
        this.questions[this.currentPage - 1].correct_answers[index] === 'false'
      ) {
        this.showResult = true;
        this.isAnswerCorrect = false;
        this.selectOption = false;
        this.questions[this.currentPage - 1].isSolvedWrong = true;
      } else {
        this.selectOption = true;
      }
    }
    if (this.currentPage >= this.questions.length) {
      this.showSubmitQuizButton = true;
    }
  }
}
