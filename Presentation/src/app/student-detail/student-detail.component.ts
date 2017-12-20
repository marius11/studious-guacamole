import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Location } from "@angular/common";

import { Course } from "../models/course";
import { Student } from "../models/student";
import { StudentService } from "../services/student.service";

@Component({
  selector: "app-student-detail",
  templateUrl: "./student-detail.component.html",
  styleUrls: ["./student-detail.component.css"]
})
export class StudentDetailComponent implements OnInit {

  student: Student;
  courses: Course[] = [];
  courseTableColumns = [
    { title: "#" },
    { title: "Name" }
  ];

  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
    this.getStudentDetails();
    this.getStudentCourses();
  }

  getStudentDetails(): void {
    this.route.params
      .switchMap((params: Params) => this.studentService.getStudentById(params["id"]))
      .subscribe(
      data => this.student = data,
      error => console.log(error)
      );
  }

  getStudentCourses(): void {
    this.route.params
      .switchMap((params: Params) => this.studentService.getCoursesByStudentId(params["id"]))
      .subscribe(
      data => this.courses = data,
      error => console.log(error)
      );
  }

  goBack() {
    this.location.back();
  }
}
