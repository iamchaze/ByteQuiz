import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = 'https://quizapi.io/api/v1/questions?api_key=qa_sk_7d9dc01cd7bb2099dd6b481b3d2f5c074e81c8fc'
  constructor(private http:HttpClient) { }

  getQuizzes(category:string, difficulty:string): Observable<any>{
    return this.http.get(`${this.baseUrl}&category=${category}&difficulty=${difficulty}&limit=15`)
  }
}
