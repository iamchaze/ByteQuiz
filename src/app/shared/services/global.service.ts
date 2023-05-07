import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(private http: HttpClient, private router: Router) { }

  databaseUrl = "http://localhost:3000"

  //-----------------CRUD--------------------
  //Get all Records (GET)
  getRecords(path:string){
    const url = `${this.databaseUrl}/${path}`
    return this.http.get(url)
  }

  //Get Single Record (GET)
  getSingleRecord(path:string, id:any){
    const url = `${this.databaseUrl}/${path}/${id}`
    return  this.http.get(url)
  }

  //Add a Record (POST)
  addRecord(path:string, id:any){
    const url = `${this.databaseUrl}/${path}`
    return this.http.post(url, id)
  }

  //Delete a Record (DELETE)
  deleteRecord(path:string, id:any){
    const url = `${this.databaseUrl}/${path}/${id}`;
    return this.http.delete(url)
  }

  //Edit a Record (PUT)
  editRecord(path:string, data:any){
    const url = `${this.databaseUrl}/${path}/${data.id}`
    return this.http.put(url, data)
  }

  // -----------------Autorization-------------------
  login(user:any, remember:boolean, userid:any){
    if(remember){
      localStorage.setItem("username", user)
      localStorage.setItem("userid", userid)
    } else {
      sessionStorage.setItem("username", user)
      sessionStorage.setItem("userid", userid)
    }
  }
  logout(data:any){
    if(confirm("Do you really want to logout?")){
      sessionStorage?.removeItem("username")
      sessionStorage?.removeItem("userid")
      localStorage?.removeItem("username")
      localStorage?.removeItem("userid")
      this.router.navigate(['/login'])
    } else {

    }

  }
}
