import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Location } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";

import { Course } from "app/models/course";
import { Student } from "app/models/student";
import { StudentService } from "app/services/student.service";

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
      .subscribe(result => {
        this.student = result;
      },
      (e: HttpErrorResponse) => {
        this.printErrorMessageToConsole(e);
      });
  }

  getStudentCourses(): void {
    this.route.params
      .switchMap((params: Params) => this.studentService.getCoursesByStudentId(params["id"]))
      .subscribe(result => {
        this.courses = result;
      },
      (e: HttpErrorResponse) => {
        this.printErrorMessageToConsole(e);
      });
  }

  goBack() {
    this.location.back();
  }

  private printErrorMessageToConsole(e: HttpErrorResponse): void {
    console.error(`Error: ${e.error} | Name: ${e.name} | Message: ${e.message} | Status: ${e.status}`);
  }
}
