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
  quizCategory:any = ["Linux", "Bash","Uncategorized","Docker","SQL","CMS","Code","DevOps"];

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
    this.category = this.quizOptions.category
    this.difficulty = this.quizOptions.difficulty

    this.router.navigate([`question/${this.category}/${this.difficulty}`])
  }
}
