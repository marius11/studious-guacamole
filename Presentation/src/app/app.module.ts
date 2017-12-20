import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppRoutingModule } from "./app-routing.module";
import { SharedModule } from "./shared/shared.module";
import { AppComponent } from "./app.component";

import { StudentService } from "./services/student.service";
import { StudentComponent } from "./student/student.component";
import { StudentDetailComponent } from "./student-detail/student-detail.component";

import { CourseService } from "./services/course.service";
import { CourseComponent } from "./course/course.component";
import { CourseDetailComponent } from "./course-detail/course-detail.component";

@NgModule({
  declarations: [
    AppComponent,
    StudentComponent,
    CourseComponent,
    CourseDetailComponent,
    StudentDetailComponent,
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    SharedModule,
    FormsModule,
  ],
  providers: [StudentService, CourseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
