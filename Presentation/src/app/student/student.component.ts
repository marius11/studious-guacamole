import { Component, OnInit } from "@angular/core";

import { Student } from "../models/student";
import { StudentService } from "../services/student.service";

@Component({
  selector: "app-student",
  templateUrl: "./student.component.html",
  styleUrls: ["./student.component.css"]
})

export class StudentComponent implements OnInit {

  private students: Student[] = [];
  private columns = [
    { title: "#" },
    { title: "First name" },
    { title: "Last name" }
  ];
  private page = 1;
  private perPage = 10;

  constructor(private studentService: StudentService) {
  }

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
}
