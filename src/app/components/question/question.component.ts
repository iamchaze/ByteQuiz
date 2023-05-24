import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  constructor(private route:ActivatedRoute, private router:Router, private service:GlobalService, private apiService:ApiService){}
  questions:any = []
  answers:any = []
  options:any = []
  category:any
  difficulty:any
  questionNo:any
  currentPage:any = 1
  isAnswerCorrect:any
  showResult:any
  solvedQuestions:any
  solvedCorrect:any
  solvedIncorrect:any

  ngOnInit(): void {
    this.category = this.route.snapshot.paramMap.get("category")
    this.difficulty = this.route.snapshot.paramMap.get("difficulty")
    this.getQuizzes()
  }
  getQuizzes(){
    this.apiService.getQuizzes(this.category, this.difficulty).subscribe(result => {
      this.questions = result
      this.questions = this.questions.map((question:any, index:any) => {
        const questionNo = index + 1;
        return {...question, questionNo}
      })

      this.questions.forEach((question:any) => {
          question.answers = Object.values(question.answers)
          question.correct_answers = Object.values(question.correct_answers)
      });
      console.log(this.questions);
    })
  }
  submitQuiz(value:any){
    console.log(value);
  }
  nextQuestion(value:any){
    this.currentPage += 1
    this.showResult = false
  }
  submitAnswer(value:any){
    this.showResult = true
    const index = this.questions[this.currentPage - 1].answers.indexOf(value.option)
    if(this.questions[this.currentPage - 1].correct_answers[index] === 'true'){
      this.isAnswerCorrect = true
    } else {
      this.isAnswerCorrect = false
    }
  }
}
