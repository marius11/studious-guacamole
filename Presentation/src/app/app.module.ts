import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";

import { SharedModule } from "./shared/shared.module";

import { AppComponent } from "./app.component";

import { StudentService } from "./services/student.service";
import { StudentComponent } from "./student/student.component";

import { CourseService } from "./services/course.service";
import { CourseComponent } from "./course/course.component";
import { CourseDetailComponent } from "./course-detail/course-detail.component";
import { InlineEditDirective } from "./directives/inline-edit.directive";

@NgModule({
  declarations: [
    AppComponent,
    StudentComponent,
    CourseComponent,
    CourseDetailComponent,
    InlineEditDirective,
  ],
  imports: [
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
