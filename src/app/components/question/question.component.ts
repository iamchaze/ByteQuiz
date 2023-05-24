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
  questionOptions:any = []
  options:any = []
  category:any
  difficulty:any
  submitConfirm:any
  confirmationContent:any
  questionNo:any
  quizQueries:any
  categories:any
  selectedCategory:any
  currentPage:any
  ngOnInit(): void {
    this.category = this.route.snapshot.paramMap.get("category")
    this.difficulty = this.route.snapshot.paramMap.get("difficulty")

    this.apiService.getQuizzes(this.category, this.difficulty).subscribe(result => {
      this.questions = result
      this.questions = this.questions.map((question:any, index:any) => {
        const questionNo = index + 1;
        return {...question, questionNo}
      })
      console.log(this.questions);
      this.questions.forEach((question:any) => {
        if(Object.values(question.answers)){
          question.answers = Object.values(question.answers)
        }
      });
    })
  }
  submitQuiz(){

  }
  onYes(){

  }
  prevQuestion(){

  }
  nextQuestion(){

  }
  onPageChange(value:any){
    this.currentPage =  value
  }
}
