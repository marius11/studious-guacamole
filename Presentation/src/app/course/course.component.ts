import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { Course } from "../models/course";
import { CourseService } from "../services/course.service";

@Component({
  selector: "app-course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"]
})
export class CourseComponent implements OnInit {

  courses: Course[];
  errorMessage: string;

  constructor(private courseService: CourseService, private router: Router) {
  }

  ngOnInit() {
    this.getAllCourses();
  }

  getAllCourses(): void {
    this.courseService.getAllCourses()
      .subscribe(
        data => this.courses = data,
        error => this.errorMessage
      );
  }
}
