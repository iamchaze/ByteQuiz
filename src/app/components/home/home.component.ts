import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  constructor(private fb: FormBuilder, private service:GlobalService, private router: Router){}
  username:any;
  password:any;
  cPassword:any;
  fullName:any;
  companyName:any;
  registerUserData:any
  existingUser:any
  usersData:any = []
  validUserRecord:any = []
  isRememberedChecked:boolean = false
  isShowPasswordChecked:boolean = false
  inputProperty:string = 'password'
  eyeIcon:any = "fa fa-eye"
  showPasswordLabel:any = "Show"

  ngOnInit() {
     if(this.isShowPasswordChecked === true){
      this.inputProperty = "text"
     } else {
      this.inputProperty = "password"
     }
  }

  login(value:any){
    console.log(value);
    this.service.getRecords("Users").subscribe(result => {
      this.usersData = result
      this.validUserRecord = this.usersData.filter((record:any) => {
        return record.username === this.username && record.password === this.password
      })
      if(this.validUserRecord?.length > 0){
        this.service.login(this.validUserRecord, this.isRememberedChecked)
        this.router.navigate(['quiz'])
      }
    })
  }

  signUp(value:any){
    this.service.getRecords("Users").subscribe(result => {
      this.registerUserData = result
      this.existingUser = this.registerUserData.filter((record:any) => {
        return value.username === record.username
      })
      if(this.existingUser?.length > 0){
        alert("User Already Exists!")
        this.router.navigate(["/"]).then(() => {
          location.reload()
        })
      } else {
        this.service.addRecord("Users", value).subscribe(result => {})
        this.router.navigate(["/"]).then(() => {
          location.reload()
        })
      }
    })
  }

  showPassword(){
    if(this.isShowPasswordChecked === false){
      this.isShowPasswordChecked = true
      this.inputProperty = "text"
      this.showPasswordLabel = "Hide"
    } else {
      this.isShowPasswordChecked = false
      this.inputProperty = "password"
      this.showPasswordLabel = "Show"
    }
  }
}
