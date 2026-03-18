import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from "rxjs";

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

type ApiListResponse<T> = T[] | { data?: T[] };
type CategoryRecord = string | { name?: string; category?: string; title?: string };

interface QuizRecord {
  id?: string | number;
  title?: string;
  description?: string | null;
  category?: string;
  difficulty?: string;
  questionCount?: number;
  plays?: number;
  usage?: number;
  tags?: Array<string | { name?: string }>;
  questions?: QuestionRecord[];
}

interface QuestionRecord {
  id?: string | number;
  question?: string;
  category?: string;
  difficulty?: string;
  explanation?: string | null;
  answers?: Record<string, string | null>;
  correct_answers?: Record<string, string>;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiRoot = 'https://quizapi.io/api/v1';
  private readonly apiKey = 'qa_sk_7d9dc01cd7bb2099dd6b481b3d2f5c074e81c8fc';
  private readonly headers = new HttpHeaders({
    Authorization: `Bearer ${this.apiKey}`
  });
  private readonly questionCache = new Map<string, QuizApiQuestion[]>();

  constructor(private http: HttpClient) {}

  getQuizCategories(): Observable<string[]> {
    return this.http
      .get<ApiListResponse<CategoryRecord>>(`${this.apiRoot}/categories`, {
        headers: this.headers
      })
      .pipe(
        map((response) => this.extractList(response)
          .map((item) => typeof item === 'string' ? item : item.name ?? item.category ?? item.title ?? '')
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b))),
        map((categories) => ['Any', ...new Set(categories)])
      );
  }

  getQuizzes(category: string, difficulty: string): Observable<QuizApiQuiz[]> {
    return this.http
      .get<ApiListResponse<QuizRecord>>(`${this.apiRoot}/quizzes`, {
        headers: this.headers,
        params: this.buildQuizParams(category, difficulty)
      })
      .pipe(
        map((response) => this.extractList(response).map((quiz) => this.mapQuiz(quiz))),
        map((quizzes) => quizzes.filter((quiz) => Boolean(quiz.id)))
      );
  }

  getQuizQuestions(quizId: string): Observable<QuizApiQuestion[]> {
    const cachedQuestions = this.questionCache.get(quizId);
    if (cachedQuestions) {
      return of(cachedQuestions);
    }

    return this.http
      .get<QuizRecord | ApiListResponse<QuestionRecord>>(`${this.apiRoot}/quizzes/${encodeURIComponent(quizId)}`, {
        headers: this.headers
      })
      .pipe(
        map((response) => this.extractQuestionsFromQuizResponse(response, quizId)),
        catchError(() => this.http
          .get<ApiListResponse<QuestionRecord>>(`${this.apiRoot}/questions`, {
            headers: this.headers,
            params: new HttpParams()
              .set('quizId', quizId)
              .set('limit', '15')
          })
          .pipe(map((response) => this.extractList(response).map((question) => this.mapQuestion(question, quizId)))))
      );
  }

  private buildQuizParams(category: string, difficulty: string): HttpParams {
    let params = new HttpParams().set('limit', '20');

    if (category && category !== 'Any') {
      params = params.set('category', category);
    }

    if (difficulty) {
      params = params.set('difficulty', difficulty);
    }

    return params;
  }

  private mapQuiz(quiz: QuizRecord): QuizApiQuiz {
    const quizId = String(quiz.id ?? '');
    const normalizedQuestions = (quiz.questions ?? []).map((question) => this.mapQuestion(question, quizId, quiz.title));

    if (quizId && normalizedQuestions.length) {
      this.questionCache.set(quizId, normalizedQuestions);
    }

    const tags = (quiz.tags ?? [])
      .map((tag) => typeof tag === 'string' ? tag : tag.name ?? '')
      .filter(Boolean);

    return {
      id: quizId,
      title: quiz.title ?? 'Untitled Quiz',
      description: quiz.description ?? '',
      category: quiz.category ?? 'General',
      difficulty: (quiz.difficulty ?? 'medium').toLowerCase(),
      questionCount: quiz.questionCount ?? normalizedQuestions.length,
      plays: quiz.plays ?? quiz.usage ?? 0,
      tags
    };
  }

  private extractQuestionsFromQuizResponse(
    response: QuizRecord | ApiListResponse<QuestionRecord>,
    quizId: string
  ): QuizApiQuestion[] {
    if (Array.isArray(response) || this.isListResponse(response)) {
      return this.extractList(response).map((question) => this.mapQuestion(question, quizId));
    }

    const questions = (response.questions ?? []).map((question: QuestionRecord) =>
      this.mapQuestion(question, quizId, response.title)
    );
    if (questions.length) {
      this.questionCache.set(quizId, questions);
    }
    return questions;
  }

  private mapQuestion(question: QuestionRecord, quizId: string, quizTitle?: string): QuizApiQuestion {
    const answers = Object.entries(question.answers ?? {})
      .filter(([, value]) => Boolean(value))
      .map(([key, value]) => ({
        id: key,
        text: value ?? '',
        isCorrect: (question.correct_answers?.[`${key}_correct`] ?? 'false') === 'true'
      }));

    return {
      id: String(question.id ?? ''),
      text: question.question ?? 'Untitled question',
      difficulty: (question.difficulty ?? 'medium').toLowerCase(),
      category: question.category ?? 'General',
      quizId,
      quizTitle: quizTitle ?? 'Quiz Session',
      explanation: question.explanation ?? undefined,
      answers
    };
  }

  private extractList<T>(response: ApiListResponse<T>): T[] {
    return Array.isArray(response) ? response : response.data ?? [];
  }

  private isListResponse<T>(response: QuizRecord | ApiListResponse<T>): response is { data?: T[] } {
    return 'data' in response;
  }
}
