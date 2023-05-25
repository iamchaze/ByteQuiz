import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizComponent } from './components/quiz/quiz.component';
import { ResultComponent } from './components/result/result.component';
import { QuestionComponent } from './components/question/question.component';

const routes: Routes = [
  {path:"", component:QuizComponent},
  {path:"quiz", component:QuizComponent},
  {path:"question/:category/:difficulty", component:QuestionComponent},
  {path:"result", component:ResultComponent},
  { path: "**", component: QuizComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
