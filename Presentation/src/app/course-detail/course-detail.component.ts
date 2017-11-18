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
  private courseNameEditing: boolean;

  private oldCourseName: string;

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.getCourseDetails();
    this.getCourseStudents();

    this.courseNameEditing = false;
  }

  getCourseDetails(): void {
    this.route.params
      .switchMap((params: Params) => this.courseService.getCourseById(params["id"]))
      .subscribe(
      data => this.course = data,
      error => console.log(error)
      );
  }

  getCourseStudents(): void {
    this.route.params
      .switchMap((params: Params) => this.courseService.getStudentsByCourseId(params["id"]))
      .subscribe(
      data => this.students = data,
      error => console.log(error)
      );
  }

  updateCourseName(course: Course): void {
    this.courseService.updateCourseName(course)
      .subscribe(
      data => console.log(data),
      error => console.log(error)
      );
  }

  enableCourseNameEditing(): void {
    this.courseNameEditing = true;
    this.oldCourseName = this.course.Name;

    console.log(`The old value is ${this.oldCourseName}`);

    setTimeout(function () {
      document.getElementById("course-name").focus();
    }, 50);
  }

  saveChanges(course: Course): void {
    this.courseNameEditing = false;

    if (this.oldCourseName !== course.Name) {
      this.updateCourseName(course);
    } else {
      console.log("Update not necessary.");
    }
  }

  goBack(): void {
    this.location.back();
  }
}
