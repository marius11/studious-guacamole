import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { StudentComponent } from "app/components/student/student.component";
import { StudentDetailComponent } from "app/components/student-detail/student-detail.component";
import { CourseComponent } from "app/components/course/course.component";
import { CourseDetailComponent } from "app/components/course-detail/course-detail.component";

const routes: Routes = [
  { path: "", redirectTo: "app", pathMatch: "full" },
  { path: "students", component: StudentComponent },
  { path: "students/:id", component: StudentDetailComponent },
  { path: "courses", component: CourseComponent },
  { path: "courses/:id", component: CourseDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
