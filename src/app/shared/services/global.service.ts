import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(private http: HttpClient, private router: Router) { }

  databaseUrl = {
    "Users": [
      {
        "id": 1,
        "username": "viraj",
        "password": "123",
        "fullName": "viraj kale",
        "companyName": "resilinc"
      },
      {
        "fullName": "manas kirad",
        "companyname": "persistent",
        "username": "manas",
        "password": "123",
        "id": 2
      },
      {
        "fullName": "satyam gaikwad",
        "companyname": "abc",
        "username": "satyam",
        "password": "654",
        "id": 3
      }
    ]
  }

  //-----------------CRUD--------------------

  //Get all Records (GET)
  getRecords(path:string){
    // const url = `${this.databaseUrl}/${path}`
    return this.databaseUrl
  }


  //Add a Record (POST)
  addRecord(path:string, data:any){
    const url = `${this.databaseUrl}/${path}`
    return this.http.post(url, data)
  }


  // -----------------Autorization-------------------
  login(userdata:any, remember:boolean){
    if(remember){
      localStorage.setItem("username", userdata[0].username);
      localStorage.setItem("userid", userdata[0].id);
    } else {
      sessionStorage.setItem("username", userdata[0].username);
      sessionStorage.setItem("userid", userdata[0].id);
    }
  }
  logout(data:any){
    if(confirm("Do you really want to logout?")){
      sessionStorage?.removeItem("username")
      sessionStorage?.removeItem("userid")
      localStorage?.removeItem("username")
      localStorage?.removeItem("userid")
      this.router.navigate(['/'])
    } else {

    }

  }
}
