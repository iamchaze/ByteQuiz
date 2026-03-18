import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizresultService } from 'src/app/shared/services/quizresult.service';

@Component({
  selector: 'app-result',
  standalone: false,
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  incorrectAns:any
  allQues:any
  totalQuestionsCount:any = 0
  wrongAnsCount:any = 0
  readonly confettiPieces = Array.from({ length: 16 }, (_, index) => index);
  readonly rainPieces = Array.from({ length: 12 }, (_, index) => index);
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

  get correctAnswersCount() {
    return this.totalQuestionsCount - this.wrongAnsCount;
  }

  get scorePercent() {
    if (!this.totalQuestionsCount) {
      return 0;
    }

    return Math.round((this.correctAnswersCount / this.totalQuestionsCount) * 100);
  }

  get isGreatScore() {
    return this.scorePercent >= 70;
  }

  get isPoorScore() {
    return this.scorePercent < 40;
  }

}
