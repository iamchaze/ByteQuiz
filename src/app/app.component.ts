import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  constructor(public router:Router){}
    isLoggedIn:boolean = false
    nav:any
    none:any
    ngOnInit(): void {
      if(sessionStorage.getItem("userid") != null){
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    }

}
