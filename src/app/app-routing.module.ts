import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { ResultComponent } from './components/result/result.component';
import { SignupComponent } from './components/signup/signup.component';
import { QuestionComponent } from './components/question/question.component';

const routes: Routes = [
  {path:"", component:HomeComponent},
  {path:"home", component:HomeComponent},
  {path:"login", component:LoginComponent},
  {path:"profile", component:ProfileComponent},
  {path:"quiz", component:QuizComponent},
  {path:"quiz", component:QuizComponent},
  {path:"question/:category/:diff", component:QuestionComponent},
  {path:"result", component:ResultComponent},
  {path:"signup", component:SignupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
