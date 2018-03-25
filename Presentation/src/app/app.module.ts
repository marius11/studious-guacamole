import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

import { AutofocusDirective } from "app/directives/autofocus.directive";
import { InlineEditComponent } from "app/components/inline-edit/inline-edit.component";

import { DataService } from "app/services/data.service";
import { StudentService } from "app/services/student.service";
import { CourseService } from "app/services/course.service";
import { SearchService } from "app/services/search.service";

import { StudentComponent } from "app/components/student/student.component";
import { StudentDetailComponent } from "app/components/student-detail/student-detail.component";

import { CourseComponent } from "app/components/course/course.component";
import { CourseDetailComponent } from "app/components/course-detail/course-detail.component";

@NgModule({
  declarations: [
    AppComponent,
    StudentComponent,
    CourseComponent,
    CourseDetailComponent,
    StudentDetailComponent,
    AutofocusDirective,
    InlineEditComponent,
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  providers: [DataService, SearchService, StudentService, CourseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
