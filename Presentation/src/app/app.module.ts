import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

import { AutofocusDirective } from "app/directives/autofocus.directive";
import { InlineEditComponent } from "app/inline-edit/inline-edit.component";

import { DataService } from "app/services/data.service";
import { SearchService } from "app/services/search.service";

import { StudentComponent } from "./student/student.component";
import { StudentDetailComponent } from "./student-detail/student-detail.component";

import { CourseComponent } from "./course/course.component";
import { CourseDetailComponent } from "./course-detail/course-detail.component";

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
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [DataService, SearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
