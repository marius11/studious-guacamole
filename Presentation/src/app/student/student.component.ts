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
  student: Student;
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
        s => this.students = s,
        error => {
          this.errorMessage = <any> error;
        });
  }
  getStudentById(id: number): void {
    this.studentService.getStudentById(id)
      .subscribe(
        s => this.student = s,
        error => {
          this.errorMessage = <any> error;
        });
  }
  getCoursesByStudentId(id: number): void {
    this.studentService.getCoursesByStudentId(id)
      .subscribe(
        c => this.courses = c,
        error => {
          this.errorMessage = <any> error;
        });
  }
}
