import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { AppRoutingModule } from "./app-routing.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

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
    NgbModule.forRoot(),
  ],
  providers: [StudentService, CourseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
