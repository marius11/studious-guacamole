import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { Course } from "../models/course";
import { Student } from "../models/student";
import { StudentService } from "../services/student.service";

@Component({
  selector: "app-student",
  templateUrl: "./student.component.html",
  styleUrls: ["./student.component.css"]
})
export class StudentComponent implements OnInit {

  private students: Student[];
  private courses: Course[];
  private selectedStudent: Student;

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

  getCoursesByStudentId(id: number): void {
    this.studentService.getCoursesByStudentId(id)
      .subscribe(
      data => this.courses = data,
      error => console.log(error)
      );
  }
}
