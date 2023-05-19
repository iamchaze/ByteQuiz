import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = 'https://quizapi.io/api/v1/questions?apiKey=BSBME7NJflwnFFbRbSBHlIHWmBh5XQc5GAXkKyu7&'
  constructor(private http:HttpClient) { }


  
}
