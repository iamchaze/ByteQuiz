import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

type QuizApiListResponse<T> = T[] | { data?: T[] };
type QuizApiCategory = string | { name?: string; category?: string };
type QuizApiCategoryResponse = QuizApiCategory[] | { data?: QuizApiCategory[] };

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly apiRoot = 'https://quizapi.io/api/v1';
  private readonly apiKey = 'BSBME7NJflwnFFbRbSBHlIHWmBh5XQc5GAXkKyu7';
  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.apiKey}`,
    'X-Api-Key': this.apiKey
  });

  constructor(private http:HttpClient) { }

  getQuizCategories(): Observable<string[]> {
    return this.http
      .get<QuizApiCategoryResponse>(`${this.apiRoot}/categories`, {
        headers: this.headers
      })
      .pipe(
        map((response) => {
          const categories = [...new Set(this.extractCategories(response))]
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b));
          return ['Any', ...categories];
        })
      );
  }

  getQuizzes(category: string, difficulty: string): Observable<QuizApiQuiz[]> {
    let params = new HttpParams().set('limit', '24');

    if (category && category !== 'Any') {
      params = params.set('category', category);
    }

    if (difficulty) {
      params = params.set('difficulty', difficulty);
    }

    return this.http
      .get<QuizApiListResponse<QuizApiQuiz>>(`${this.apiRoot}/quizzes`, {
        headers: this.headers,
        params
      })
      .pipe(map((response) => this.extractList(response)));
  }

  getQuizQuestions(quizId: string): Observable<QuizApiQuestion[]> {
    const params = new HttpParams()
      .set('quizId', quizId)
      .set('limit', '15');

    return this.http
      .get<QuizApiListResponse<QuizApiQuestion>>(`${this.apiRoot}/questions`, {
        headers: this.headers,
        params
      })
      .pipe(map((response) => this.extractList(response)));
  }

  private extractList<T>(response: QuizApiListResponse<T>): T[] {
    return Array.isArray(response) ? response : response.data ?? [];
  }

  private extractCategories(response: QuizApiCategoryResponse): string[] {
    const categories = Array.isArray(response) ? response : response.data ?? [];
    return categories
      .map((category) => typeof category === 'string'
        ? category
        : category.name ?? category.category ?? '')
      .filter(Boolean);
  }
}
