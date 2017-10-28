import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { StudentComponent } from "./student/student.component";
import { CourseComponent } from "./course/course.component";

const routes: Routes = [
  { path: "*", redirectTo: "" },
  { path: "students", component: StudentComponent },
  { path: "courses", component: CourseComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
