import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from "rxjs";

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

interface QuizApiQuestionRecord {
  id?: number | string;
  question?: string;
  category?: string;
  difficulty?: string;
  description?: string | null;
  tags?: Array<{ name?: string }>;
  answers?: Record<string, string | null>;
  correct_answers?: Record<string, string>;
  explanation?: string | null;
}

const FALLBACK_CATEGORIES = [
  'Any',
  'Code',
  'CMS',
  'DevOps',
  'Docker',
  'Linux',
  'SQL',
  'BASH',
  'Uncategorized'
];

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly apiRoot = 'https://quizapi.io/api/v1';
  private readonly apiKey = 'BSBME7NJflwnFFbRbSBHlIHWmBh5XQc5GAXkKyu7';
  private readonly questionCache = new Map<string, QuizApiQuestion[]>();

  constructor(private http:HttpClient) { }

  getQuizCategories(): Observable<string[]> {
    return this.http
      .get<QuizApiCategoryResponse>(`${this.apiRoot}/categories`, {
        params: new HttpParams().set('apiKey', this.apiKey)
      })
      .pipe(
        map((response) => {
          const categories = [...new Set(this.extractCategories(response))]
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b));
          return categories.length ? ['Any', ...categories] : FALLBACK_CATEGORIES;
        })
      );
  }

  getQuizzes(category: string, difficulty: string): Observable<QuizApiQuiz[]> {
    return this.http
      .get<QuizApiListResponse<QuizApiQuestionRecord>>(`${this.apiRoot}/questions`, {
        params: this.buildQuestionParams(category, difficulty)
      })
      .pipe(
        map((response) => this.extractList(response).map((item) => this.mapQuestion(item))),
        map((questions) => {
          if (!questions.length) {
            return [];
          }

          const quizId = this.createQuizId(category, difficulty);
          this.questionCache.set(quizId, questions);

          const firstQuestion = questions[0];
          const questionCount = questions.length;

          return [{
            id: quizId,
            title: this.buildQuizTitle(category, difficulty),
            description: `Generated from live QuizAPI questions for ${firstQuestion.category} at ${firstQuestion.difficulty} level.`,
            category: firstQuestion.category,
            difficulty: firstQuestion.difficulty,
            questionCount,
            plays: questionCount,
            tags: [firstQuestion.category, firstQuestion.difficulty]
          }];
        })
      );
  }

  getQuizQuestions(quizId: string): Observable<QuizApiQuestion[]> {
    const cachedQuestions = this.questionCache.get(quizId);
    if (cachedQuestions) {
      return of(cachedQuestions);
    }

    const filters = this.parseQuizId(quizId);
    if (!filters) {
      return of([]);
    }

    return this.http
      .get<QuizApiListResponse<QuizApiQuestionRecord>>(`${this.apiRoot}/questions`, {
        params: this.buildQuestionParams(filters.category, filters.difficulty)
      })
      .pipe(map((response) => this.extractList(response).map((item) => this.mapQuestion(item))));
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

  private buildQuestionParams(category: string, difficulty: string): HttpParams {
    let params = new HttpParams()
      .set('apiKey', this.apiKey)
      .set('limit', '10');

    if (category && category !== 'Any') {
      params = params.set('category', category);
    }

    if (difficulty) {
      params = params.set('difficulty', difficulty);
    }

    return params;
  }

  private mapQuestion(question: QuizApiQuestionRecord): QuizApiQuestion {
    const answers = Object.entries(question.answers ?? {})
      .filter(([, value]) => Boolean(value))
      .map(([key, value]) => ({
        id: key,
        text: value ?? '',
        isCorrect: (question.correct_answers?.[`${key}_correct`] ?? 'false') === 'true'
      }));

    return {
      id: String(question.id ?? crypto.randomUUID()),
      text: question.question ?? 'Untitled question',
      difficulty: question.difficulty ?? 'medium',
      category: question.category ?? 'General',
      quizId: this.createQuizId(question.category ?? 'Any', question.difficulty ?? 'medium'),
      quizTitle: this.buildQuizTitle(question.category ?? 'Any', question.difficulty ?? 'medium'),
      explanation: question.explanation ?? undefined,
      answers
    };
  }

  private buildQuizTitle(category: string, difficulty: string): string {
    const normalizedCategory = category && category !== 'Any' ? category : 'Mixed';
    const normalizedDifficulty = difficulty || 'mixed';
    return `${normalizedCategory} ${normalizedDifficulty} challenge`;
  }

  private createQuizId(category: string, difficulty: string): string {
    return `${encodeURIComponent(category || 'Any')}::${encodeURIComponent(difficulty || 'mixed')}`;
  }

  private parseQuizId(quizId: string): { category: string; difficulty: string } | null {
    const [category, difficulty] = quizId.split('::');
    if (!category || !difficulty) {
      return null;
    }

    return {
      category: decodeURIComponent(category),
      difficulty: decodeURIComponent(difficulty)
    };
  }
}
