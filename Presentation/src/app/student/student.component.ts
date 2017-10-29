import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { Student } from "../models/student";
import { StudentService } from "../services/student.service";

import { Course } from "../models/course";

import { MatSnackBar } from "@angular/material";

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

  constructor(private studentService: StudentService, private router: Router, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.getAllStudents();
  }

  getAllStudents(): void {
    this.studentService.getAllStudents()
      .subscribe(
        data => this.students = data,
        error => this.snackBar.open("An unexpected error occurred.", "", { duration: 5000 })
      );
  }
  getCoursesByStudentId(id: number): void {
    this.studentService.getCoursesByStudentId(id)
      .subscribe(
        data => this.courses = data,
        error => this.snackBar.open("An unexpected error occurred.", "", { duration: 5000 })
      );
  }
}
