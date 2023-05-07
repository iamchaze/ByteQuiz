import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  constructor(private service:GlobalService, private router:Router){}

  logout(){
    let d = "new"
    this.service.logout(d)
  }
  goToProfile(){
    this.router.navigate(['profile'])
  }
}
