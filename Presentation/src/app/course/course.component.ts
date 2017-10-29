import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { Course } from "../models/course";
import { CourseService } from "../services/course.service";

import { MatSnackBar } from "@angular/material";

@Component({
  selector: "app-course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"]
})
export class CourseComponent implements OnInit {

  courses: Course[];
  errorMessage: string;

  constructor(private courseService: CourseService, private router: Router, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.getAllCourses();
  }

  getAllCourses(): void {
    this.courseService.getAllCourses()
      .subscribe(
        data => this.courses = data,
        error => this.snackBar.open("An unexpected error occurred.", "", { duration: 5000 })
      );
  }
}
