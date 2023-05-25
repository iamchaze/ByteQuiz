import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { ResultComponent } from './components/result/result.component';
import { QuestionComponent } from './components/question/question.component';
import { authGuard } from './shared/guard/auth.guard';

const routes: Routes = [
  {path:"", component:HomeComponent},
  {path:"home", component:HomeComponent},
  {path:"quiz", component:QuizComponent, canActivate:[authGuard]},
  {path:"question/:category/:difficulty", component:QuestionComponent, canActivate:[authGuard]},
  {path:"result", component:ResultComponent, canActivate:[authGuard]},
  { path: "**", component: HomeComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
