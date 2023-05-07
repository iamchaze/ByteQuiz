import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from "primeng/dropdown";
import {
  Validators,
  FormControl,
  FormGroup,
  FormBuilder,
} from "@angular/forms";
import { Router } from '@angular/router';
@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  quizOptions:any
  category:any
  difficulty:any
  quizForm: any;
  quizDifficilty = [
    {
      label: "Easy",
      value: "easy",
    },
    {
      label: "Medium",
      value: "medium",
    },
    {
      label: "Hard",
      value: "hard",
    },
  ];
  quizCategory:any = [
    { name: "Movies", code: 11 },
    { name: "Technology", code: 18 },
    { name: "Sports", code: 21 },
    { name: "History", code: 23 },
    { name: "Politics", code: 24 },
    { name: "Mathematics", code: 19 },
  ];


  constructor(
    private fb: FormBuilder,
    private router: Router
  ){}
  ngOnInit(): void {
    this.quizForm = this.fb.group({
      category: new FormControl('', Validators.required),
      difficulty: new FormControl("", Validators.required)
    })
  }
  onSubmit(value: string) {

    this.quizOptions = value
    this.category = this.quizOptions.category.name
    this.difficulty = this.quizOptions.difficulty

    this.router.navigate([`question/${this.category}/${this.difficulty}`])
  }
}
