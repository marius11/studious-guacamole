import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Location } from "@angular/common";

import { Course } from "../models/course";
import { CourseService } from "../services/course.service";

@Component({
  selector: "app-course-detail",
  templateUrl: "./course-detail.component.html",
  styleUrls: ["./course-detail.component.css"]
})

export class CourseDetailComponent implements OnInit {

  private course: Course;

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
    this.getCourseDetails();
  }

  getCourseDetails() {
    this.route.params
      .switchMap((params: Params) => this.courseService.getCourseById(params["id"]))
      .subscribe(data => this.course = data);
  }

  callMe() {
  }

  saveCourseName() {
  }

  goBack() {
    this.location.back();
  }
}
