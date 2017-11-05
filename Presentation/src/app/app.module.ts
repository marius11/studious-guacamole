import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { AppRoutingModule } from "./app-routing.module";

import { SharedModule } from "./shared/shared.module";

import { AppComponent } from "./app.component";

import { StudentService } from "./services/student.service";
import { StudentComponent } from "./student/student.component";

import { CourseService } from "./services/course.service";
import { CourseComponent } from "./course/course.component";

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
    SharedModule,
  ],
  providers: [StudentService, CourseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
