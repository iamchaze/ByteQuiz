import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    isDarkMode = false;

  constructor(
    public router:Router
  ){}
    isLoggedIn:boolean = false
    nav:any
    none:any
    ngOnInit(): void {
      this.isDarkMode = localStorage.getItem('bytequiz-theme') === 'dark';

      if(sessionStorage.getItem("userid") != null){
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    }

    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      localStorage.setItem('bytequiz-theme', this.isDarkMode ? 'dark' : 'light');
    }

}
