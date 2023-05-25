import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = 'https://quizapi.io/api/v1/questions?apiKey=BSBME7NJflwnFFbRbSBHlIHWmBh5XQc5GAXkKyu7'
  constructor(private http:HttpClient) { }

  getQuizzes(category:string, difficulty:string): Observable<any>{
    return this.http.get(`${this.baseUrl}&category=${category}&difficulty=${difficulty}&limit=15`)
  }
}
