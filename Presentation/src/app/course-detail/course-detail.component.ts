import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Location } from "@angular/common";

import { Student } from "../models/student";
import { Course } from "../models/course";
import { CourseService } from "../services/course.service";

@Component({
  selector: "app-course-detail",
  templateUrl: "./course-detail.component.html",
  styleUrls: ["./course-detail.component.css"]
})

export class CourseDetailComponent implements OnInit {

  private course: Course;
  private students: Student[];

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getCourseDetails();
    this.getCourseStudents();
  }

  getCourseDetails(): void {
    this.route.params
      .switchMap((params: Params) => this.courseService.getCourseById(params["id"]))
      .subscribe(data => this.course = data);
  }

  getCourseStudents(): void {
    this.route.params
      .switchMap((params: Params) => this.courseService.getStudentsByCourseId(params["id"]))
      .subscribe(data => this.students = data);
  }

  goBack(): void {
    this.location.back();
  }
}
