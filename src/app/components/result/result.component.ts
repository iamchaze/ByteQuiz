import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizresultService } from 'src/app/shared/services/quizresult.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  incorrectAns:any
  allQues:any
  totalQuestionsCount:any = 0
  wrongAnsCount:any = 0
  constructor(private quizresult: QuizresultService, private router:Router){}

  ngOnInit(){
    this.getQueData()
    // console.log(this.allQues);
  }

  getQueData(){
      this.allQues = this.quizresult.showQuestionsData()
      if(this.allQues){
        this.totalQuestionsCount = this.allQues?.length
      this.allQues.forEach((question:any) => {
        // console.log(question);
        if(question.hasOwnProperty('isSolvedWrong')){
          this.wrongAnsCount +=1
        }
      });
      }
  }
  goToQuiz(){
    this.router.navigate(['quiz'])
  }

}
