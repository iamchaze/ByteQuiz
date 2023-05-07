import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/shared/services/global.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router:Router, private service: GlobalService){}
  username:any
  password:any
  userData:any = []
  userid:any
  remember:boolean = false
  showPasswordFlag:any = "password"

  navigateToSignUp(){
    this.router.navigate(['/sign-up'])
  }
  login(){
    // console.log(this.username, this.password);

    this.service.getRecords("Users").subscribe((res) =>{
      this.userData = res
      const matchingRecord = this.userData.filter(
        (record:any) => {
          return record.username == this.username && record.password == this.password
        }
      )


        if(matchingRecord.length > 0)
        {
          this.userid = matchingRecord[0].id
          this.service.login(this.username, this.remember, this.userid)
          this.router.navigate(['/quiz'])
        } else {
          alert("Invalid Credentials")
          this.username = ""
          this.password = ""
        }
    })
  }
  showPassword(){
    if(this.showPasswordFlag == "password"){
      this.showPasswordFlag = "text"
    } else {
      this.showPasswordFlag = "password"
    }
  }
}

