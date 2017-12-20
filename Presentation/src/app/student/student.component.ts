import { Component, OnInit } from "@angular/core";

import { Student } from "../models/student";
import { StudentService } from "../services/student.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-student",
  templateUrl: "./student.component.html",
  styleUrls: ["./student.component.css"]
})

export class StudentComponent implements OnInit {

  students: Student[] = [];
  columns = [
    { title: "#" },
    { title: "First name" },
    { title: "Last name" }
  ];
  page = 1;
  perPage = 8;

  constructor(
    private studentService: StudentService,
    private router: Router) { }

  ngOnInit(): void {
    this.getStudentsPaged(this.page, this.perPage);
  }

  getAllStudents(): void {
    this.studentService.getAllStudents()
      .subscribe(
      data => this.students = data,
      error => console.log(error)
      );
  }

  getStudentsPaged(page: number, per_page: number): void {
    this.studentService.getStudentsPaged(page, per_page)
      .subscribe(
      data => this.students = data,
      error => console.log(error)
      );
  }

  goToStudentDetails(student: Student): void {
    this.router.navigate(["demo/students", student.Id]);
  }
}
