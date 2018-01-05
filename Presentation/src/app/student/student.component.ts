import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

import { DataModel } from "app/models/data-model";
import { DataService } from "app/services/data.service";

import { Student } from "app/models/student";

import "rxjs/add/operator/delay";

@Component({
  selector: "app-student",
  templateUrl: "./student.component.html",
  styleUrls: ["./student.component.css"]
})

export class StudentComponent implements OnInit {

  private API_STUDENT_PATH = "students";
  private RESPONSE_DELAY_TIMER = 1000;

  student: Student = new Student("", "");
  students: DataModel<Student[]> = { Data: [], Count: 0 };
  columns = [
    { title: "#" },
    { title: "First name" },
    { title: "Last name" }
  ];
  page = 1;
  perPage = 8;

  constructor(
    private router: Router,
    private dataService: DataService) { }

  ngOnInit(): void {
    this.getStudentsPaged(this.page, this.perPage);
  }

  getStudentsPaged(page: number, per_page: number): void {
    this.dataService.getItemsPaged<Student[]>(this.API_STUDENT_PATH, page, per_page)
      .delay(this.RESPONSE_DELAY_TIMER)
      .subscribe(result => {
        this.students = result;
      },
      (e: HttpErrorResponse) => {
        this.printErrorMessageToConsole(e);
      });
  }

  goToStudentDetails(student: Student): void {
    this.router.navigate(["app/students", student.Id]);
  }

  private printErrorMessageToConsole(e: HttpErrorResponse): void {
    if (e.error instanceof Error) {
      console.error("An error occurred: ", e.error.message);
    } else {
      console.error(`Backend returned status code ${e.status} and body: ${JSON.stringify(e.error)}`);
    }
  }
}
