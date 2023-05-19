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
  addRecord(path:string, data:any){
    const url = `${this.databaseUrl}/${path}`
    return this.http.post(url, data)
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
  login(userdata:any, remember:boolean){
    console.log(userdata);
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
