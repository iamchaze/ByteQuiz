import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { ResultComponent } from './components/result/result.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavComponent } from './components/nav/nav.component';

//primeng Modules -------------------------------

import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SelectButtonModule } from "primeng/selectbutton";
import { ButtonModule } from "primeng/button";
import { PaginatorModule } from "primeng/paginator";
import { FieldsetModule } from "primeng/fieldset";
import { RadioButtonModule } from "primeng/radiobutton";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { DynamicDialogModule } from "primeng/dynamicdialog";
import { VirtualScrollerModule } from "primeng/virtualscroller";
import { CardModule } from "primeng/card";
import { QuestionComponent } from './components/question/question.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    QuizComponent,
    ResultComponent,
    ProfileComponent,
    NavComponent,
    QuestionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    DropdownModule,
    InputTextModule,
    BrowserAnimationsModule,
    SelectButtonModule,
    ButtonModule,
    PaginatorModule,
    FieldsetModule,
    RadioButtonModule,
    ConfirmDialogModule,
    DialogModule,
    DynamicDialogModule,
    VirtualScrollerModule,
    CardModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
