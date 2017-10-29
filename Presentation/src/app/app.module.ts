import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { StudentService } from "./services/student.service";
import { StudentComponent } from "./student/student.component";

import { CourseService } from "./services/course.service";
import { CourseComponent } from "./course/course.component";

import { MatSnackBarModule } from "@angular/material";

@NgModule({
  declarations: [
    AppComponent,
    StudentComponent,
    CourseComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
  ],
  providers: [StudentService, CourseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
