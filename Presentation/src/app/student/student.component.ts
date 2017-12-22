import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

import { Student } from "app/models/student";
import { StudentService } from "app/services/student.service";

@Component({
  selector: "app-student",
  templateUrl: "./student.component.html",
  styleUrls: ["./student.component.css"]
})

export class StudentComponent implements OnInit {

  student: Student = new Student("", "");
  students: Student[] = [];
  columns = [
    { title: "#" },
    { title: "First name" },
    { title: "Last name" }
  ];
  page = 1;
  perPage = 8;

  constructor(
    private router: Router,
    private studentService: StudentService) { }

  ngOnInit(): void {
    this.getStudentsPaged(this.page, this.perPage);
  }

  getStudentsPaged(page: number, per_page: number): void {
    this.studentService.getStudentsPaged(page, per_page).subscribe(result => {
      this.students = result;
    },
      (e: HttpErrorResponse) => {
        this.printErrorMessageToConsole(e);
      });
  }

  goToStudentDetails(student: Student): void {
    this.router.navigate(["demo/students", student.Id]);
  }

  private printErrorMessageToConsole(e: HttpErrorResponse): void {
    console.error(`Error: ${e.error} | Name: ${e.name} | Message: ${e.message} | Status: ${e.status}`);
  }
}
