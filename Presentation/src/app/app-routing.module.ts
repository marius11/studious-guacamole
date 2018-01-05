import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { StudentComponent } from "./student/student.component";
import { StudentDetailComponent } from "./student-detail/student-detail.component";
import { CourseComponent } from "./course/course.component";
import { CourseDetailComponent } from "./course-detail/course-detail.component";

const routes: Routes = [
  { path: "", redirectTo: "", pathMatch: "full" },
  { path: "app/students", component: StudentComponent },
  { path: "app/students/:id", component: StudentDetailComponent },
  { path: "app/courses", component: CourseComponent },
  { path: "app/courses/:id", component: CourseDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
