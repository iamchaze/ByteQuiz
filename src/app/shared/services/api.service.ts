import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from "rxjs";

export interface QuizApiAnswer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizApiQuestion {
  id: string;
  text: string;
  difficulty: string;
  category: string;
  quizId: string;
  quizTitle: string;
  explanation?: string;
  answers: QuizApiAnswer[];
}

interface QuizApiResponse {
  success: boolean;
  data: QuizApiQuestion[];
}

export interface QuizApiQuiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  questionCount: number;
  plays: number;
  tags: string[];
}

interface QuizApiQuizResponse {
  success: boolean;
  data: QuizApiQuiz[];
}

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

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = 'https://quizapi.io/api/v1/questions?apiKey=BSBME7NJflwnFFbRbSBHlIHWmBh5XQc5GAXkKyu7'
  constructor(private http:HttpClient) { }

  getQuizCategories(): Observable<string[]> {
    return this.http
      .get<QuizApiQuizResponse>(`${this.baseUrl}/quizzes?limit=100`, {
        headers: this.headers
      })
      .pipe(
        map((response) => {
          const categories = [...new Set((response.data ?? []).map((quiz) => quiz.category))]
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b));
          return ['Any', ...categories];
        })
      );
  }

  getQuizzes(category: string, difficulty: string): Observable<QuizApiQuiz[]> {
    const query = ['limit=24'];

    if (category && category !== 'Any') {
      query.unshift(`category=${encodeURIComponent(category)}`);
    }

    if (difficulty) {
      query.unshift(`difficulty=${encodeURIComponent(difficulty)}`);
    }

    return this.http
      .get<QuizApiQuizResponse>(`${this.baseUrl}/quizzes?${query.join('&')}`, {
        headers: this.headers
      })
      .pipe(map((response) => response.data ?? []));
  }

  getQuizQuestions(quizId: string): Observable<QuizApiQuestion[]> {
    return this.http
      .get<QuizApiResponse>(`${this.baseUrl}/questions?quizId=${encodeURIComponent(quizId)}&limit=15`, {
        headers: this.headers
      })
      .pipe(map((response) => response.data ?? []));
  }
}
