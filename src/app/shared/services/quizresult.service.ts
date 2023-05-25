import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuizresultService {

  solvedQue:any
  solvedIncorrect:any


  constructor() { }

  getQuestionsData(questionsArray:any){
    this.solvedQue = questionsArray
  }

  showQuestionsData(){
    return this.solvedQue
  }
}
