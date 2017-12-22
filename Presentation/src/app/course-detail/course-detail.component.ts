import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Location } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";

import { Student } from "app/models/student";
import { Course } from "app/models/course";
import { CourseService } from "app/services/course.service";

import "rxjs/add/operator/switchMap";

@Component({
  selector: "app-course-detail",
  templateUrl: "./course-detail.component.html",
  styleUrls: ["./course-detail.component.css"]
})

export class CourseDetailComponent implements OnInit {

  course: Course;
  students: Student[];
  courseNameEditing: boolean;
  oldCourseName: string;
  studentTableColumns = [
    { title: "#" },
    { title: "First name" },
    { title: "Last name" }
  ];

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCourseDetails();
    this.getCourseStudents();
  }

  getCourseDetails(): void {
    this.route.params
      .switchMap((params: Params) => this.courseService.getCourseById(params["id"]))
      .subscribe(result => {
        this.course = result;
      },
      (e: HttpErrorResponse) => {
        this.printErrorMessageToConsole(e);
      });
  }

  getCourseStudents(): void {
    this.route.params
      .switchMap((params: Params) => this.courseService.getStudentsByCourseId(params["id"]))
      .subscribe(result => {
        this.students = result;
      },
      (e: HttpErrorResponse) => {
        this.printErrorMessageToConsole(e);
      });
  }

  updateCourseName(course: Course): void {
    this.courseService.updateCourseName(course)
      .subscribe(result => {
        console.log(result);
      },
      (e: HttpErrorResponse) => {
        this.printErrorMessageToConsole(e);
      });
  }

  enableCourseNameEditing(): void {
    this.courseNameEditing = !this.courseNameEditing;
    this.oldCourseName = this.course.Name;

    console.log(`The old value is ${this.oldCourseName}`);

    setTimeout(function () {
      document.getElementById("course-name-input").focus();
    }, 10);
  }

  disableCourseNameEditing(): void {
    this.courseNameEditing = !this.courseNameEditing;
    this.course.Name = this.oldCourseName;
  }

  saveChanges(course: Course): void {
    this.courseNameEditing = !this.courseNameEditing;

    if (this.oldCourseName !== course.Name) {
      this.updateCourseName(course);
    } else {
      console.log("Update not necessary.");
    }
  }

  deleteCourse(id: number): void {
    let confirmation = window.confirm("Are you sure you want to delete this course?");

    if (confirmation === true) {
      this.courseService.deleteCourse(id)
        .subscribe(
        data => console.log(data),
        error => {
          console.log(error);
        }
        );

      setTimeout(() => {
        this.router.navigate(["demo/courses"]);
      }, 100);
    } else {
      console.log(`Deletion for course ID ${id} has been cancelled`);
    }
  }

  goBack(): void {
    this.location.back();
  }

  private printErrorMessageToConsole(e: HttpErrorResponse): void {
    console.error(`Error: ${e.error} | Name: ${e.name} | Message: ${e.message} | Status: ${e.status}`);
  }
}
