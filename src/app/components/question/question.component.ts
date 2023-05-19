import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  constructor(private route:ActivatedRoute, private router:Router, private service:GlobalService){}
  questions:any
  answers:any
  ngOnInit(): void {
    
    this.service.getRecords("Questions").subscribe(result =>
      {
         this.questions = result
         this.answers = this.questions.answers
         console.log(this.questions);
      })
  }
}
