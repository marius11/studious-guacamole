import { Component, OnInit } from "@angular/core";

import { Student } from "../models/student";
import { StudentService } from "../services/student.service";

@Component({
  selector: "app-student",
  templateUrl: "./student.component.html",
  styleUrls: ["./student.component.css"]
})

export class StudentComponent implements OnInit {

  private students: Student[];

  private columns = [
    { title: "#" },
    { title: "First name" },
    { title: "Last name" }
  ];

  constructor(private studentService: StudentService) {
  }

  ngOnInit(): void {
    this.getAllStudents();
  }

  getAllStudents(): void {
    this.studentService.getAllStudents()
      .subscribe(
      data => this.students = data,
      error => console.log(error)
      );
  }
}
