import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute, Params } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

import { Course } from "app/models/course";
import { Student } from "app/models/student";
import { DataService } from "app/services/data.service";

import { Observable } from "rxjs/Observable";
import { delay } from "rxjs/operators";
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

  private API_STUDENT_PATH = "students";
  private API_STUDENT_SUB_PATH = "courses";
  private RESPONSE_DELAY_TIMER = 1000;

  student: Student;
  courses: Course[] = [];
  courseTableColumns = [
    { title: "#" },
    { title: "Name" }
  ];

  constructor(private dataService: DataService, private route: ActivatedRoute, private location: Location) { }

  ngOnInit(): void {
    this.getStudentDetails();
  }

  getStudentDetails(): void {
    this.route.params.subscribe(params => {
      let studentApiCall = this.dataService.getItemById<Student>(this.API_STUDENT_PATH, +params["id"]);
      let studentCoursesApiCall = this.dataService.getSubItemByItemId<Course[]>(
        this.API_STUDENT_PATH, +params["id"], this.API_STUDENT_SUB_PATH);

      Observable.forkJoin([studentApiCall, studentCoursesApiCall])
        .delay(this.RESPONSE_DELAY_TIMER)
        .subscribe(result => {
          this.student = result[DATA.STUDENT];
          this.courses = result[DATA.COURSE];
        },
        (e: HttpErrorResponse) => {
          this.printErrorMessageToConsole(e);
        });
    });
  }

  goBack(): void {
    this.location.back();
  }

  private printErrorMessageToConsole(e: HttpErrorResponse): void {
    if (e.error instanceof Error) {
      console.error(`App: An error occurred: ${e.error.message}`);
    } else {
      console.error(`App: Backend returned status code ${e.status} and body: ${JSON.stringify(e.error)}`);
    }
  }
}
