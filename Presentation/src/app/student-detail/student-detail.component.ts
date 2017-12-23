import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute, Params } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

import { Course } from "app/models/course";
import { Student } from "app/models/student";
import { StudentService } from "app/services/student.service";

import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/forkJoin";

enum DATA {
  STUDENT,
  COURSE
}

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
  }

  getStudentDetails(): void {
    this.route.params.subscribe(params => {
      let studentApiCall = this.studentService.getStudentById(+params["id"]);
      let studentCoursesApiCall = this.studentService.getCoursesByStudentId(+params["id"]);

      Observable.forkJoin([studentApiCall, studentCoursesApiCall])
        .subscribe(result => {
          this.student = result[DATA.STUDENT];
          this.courses = result[DATA.COURSE];
        },
        (e: HttpErrorResponse) => {
          this.printErrorMessageToConsole(e);
        });
    });
  }

  goBack() {
    this.location.back();
  }

  private printErrorMessageToConsole(e: HttpErrorResponse): void {
    if (e.error instanceof Error) {
      console.error("An error occurred: ", e.error.message);
    } else {
      console.error(`Backend returned status code ${e.status} and body: ${JSON.stringify(e.error)}`);
    }
  }
}
