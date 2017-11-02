import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { Student } from "../models/student";
import { StudentService } from "../services/student.service";

import { Course } from "../models/course";

@Component({
  selector: "app-student",
  templateUrl: "./student.component.html",
  styleUrls: ["./student.component.css"]
})
export class StudentComponent implements OnInit {

  students: Student[];
  courses: Course[];
  errorMessage: string;
  selectedStudent: Student;

  constructor(private studentService: StudentService, private router: Router) {
  }

  ngOnInit() {
    this.getAllStudents();
  }

  getAllStudents(): void {
    this.studentService.getAllStudents()
      .subscribe(
        data => this.students = data,
        error => this.errorMessage = error
      );
  }
  getCoursesByStudentId(id: number): void {
    this.studentService.getCoursesByStudentId(id)
      .subscribe(
        data => this.courses = data,
        error => this.errorMessage = error
      );
  }
}
