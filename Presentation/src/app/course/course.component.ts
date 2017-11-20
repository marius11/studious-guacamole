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

  private courses: Course[];

  constructor(
    private courseService: CourseService,
    private router: Router) { }

  ngOnInit(): void {
    this.getAllCourses();
  }

  getAllCourses(): void {
    this.courseService.getAllCourses()
      .subscribe(
      data => this.courses = data,
      error => console.log(error)
      );
  }

  goToCourseDetails(course: Course) {
    this.router.navigate(["demo/courses", course.Id]);
  }
}
