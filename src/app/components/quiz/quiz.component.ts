import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  Validators,
  FormControl,
  FormBuilder,
} from "@angular/forms";
import { Router } from '@angular/router';
import { ApiService, QuizApiQuiz } from 'src/app/shared/services/api.service';

const FALLBACK_CATEGORIES = [
  'Any',
  'Cybersecurity',
  'Data Science',
  'DevOps',
  'DevOps/Cloud',
  'History',
  'Literature',
  'Mathematics',
  'Programming',
  'Science'
];

@Component({
  selector: 'app-quiz',
  standalone: false,
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  quizForm: any;
  quizDifficulty = ["easy", "medium", "hard"];
  quizCategory:any = ["Any"];
  quizzes: QuizApiQuiz[] = [];
  hasSearched = false;
  isLoadingCategories = false;
  isLoadingQuizzes = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.quizForm = this.fb.group({
      category: new FormControl('Any', Validators.required),
      difficulty: new FormControl("", Validators.required)
    });

    this.loadCategories();
  }

  loadCategories() {
    this.isLoadingCategories = true;
    this.apiService.getQuizCategories().subscribe((categories) => {
      this.quizCategory = categories;
      this.isLoadingCategories = false;
      this.cdr.detectChanges();
    }, () => {
      this.quizCategory = FALLBACK_CATEGORIES;
      this.isLoadingCategories = false;
      this.cdr.detectChanges();
    });
  }

  loadQuizzes() {
    const category = this.quizForm?.value?.category ?? 'Any';
    const difficulty = this.quizForm?.value?.difficulty ?? '';

    this.isLoadingQuizzes = true;
    this.errorMessage = '';
    this.apiService.getQuizzes(category, difficulty).subscribe((quizzes) => {
      this.quizzes = quizzes;
      if (!quizzes.length) {
        this.errorMessage = 'No quizzes are currently available for this filter.';
      }
      this.isLoadingQuizzes = false;
      this.cdr.detectChanges();
    }, () => {
      this.quizzes = [];
      this.errorMessage = 'Unable to load quizzes right now.';
      this.isLoadingQuizzes = false;
      this.cdr.detectChanges();
    });
  }

  showResults() {
    this.quizForm.markAllAsTouched();
    this.quizForm.updateValueAndValidity();

    if (!this.quizForm.valid) {
      return;
    }

    this.hasSearched = true;
    this.quizzes = [];
    this.errorMessage = '';
    this.cdr.detectChanges();
    this.loadQuizzes();
  }

  startQuiz(quiz: QuizApiQuiz) {
    this.router.navigate(['question', quiz.id]);
  }
}
