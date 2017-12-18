import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { StudentComponent } from "./student/student.component";
import { CourseComponent } from "./course/course.component";
import { CourseDetailComponent } from "./course-detail/course-detail.component";

const routes: Routes = [
  { path: "", redirectTo: "", pathMatch: "full" },
  { path: "demo/students", component: StudentComponent },
  { path: "demo/courses", component: CourseComponent },
  { path: "demo/courses/:id", component: CourseDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
