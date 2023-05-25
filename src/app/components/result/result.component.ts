import { Component, OnInit } from '@angular/core';
import { QuizresultService } from 'src/app/shared/services/quizresult.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  incorrectAns:any
  allQues:any
  totalQuestionsCount:number = 3
  constructor(private quizresult: QuizresultService){}

  ngOnInit(){
    this.getQueData()
    console.log(this.allQues);
  }

  getQueData(){
      this.allQues = this.quizresult.showQuestionsData()
  }
}
