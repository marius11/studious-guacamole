import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Location } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";

import { Student } from "app/models/student";
import { Course } from "app/models/course";
import { DataService } from "app/services/data.service";

import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/delay";

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
  isRequestProcessing = false;

  private API_COURSE_PATH = "courses";
  private RESPONSE_DELAY_TIMER = 1000;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCourseDetails();
  }

  getCourseDetails(): void {
    this.isRequestProcessing = true;
    this.route.params.
      switchMap((params: Params) => this.dataService.getItemById<Course>(this.API_COURSE_PATH, +params["id"]))
      .delay(this.RESPONSE_DELAY_TIMER)
      .subscribe(result => {
        this.course = result;
        this.students = result.Students;
        this.isRequestProcessing = false;
      },
      (e: HttpErrorResponse) => {
        this.printErrorMessageToConsole(e);
      });
  }

  updateCourseName(course: Course): void {
    this.isRequestProcessing = true;
    this.dataService.updateItem<Course>(this.API_COURSE_PATH, course.Id, course)
      .delay(this.RESPONSE_DELAY_TIMER)
      .subscribe(result => {
        console.log(result);
        this.courseNameEditing = !this.courseNameEditing;
        this.isRequestProcessing = false;
      },
      (e: HttpErrorResponse) => {
        this.printErrorMessageToConsole(e);
        this.isRequestProcessing = false;
      });
  }

  enableCourseNameEditing(): void {
    this.courseNameEditing = !this.courseNameEditing;
    this.oldCourseName = this.course.Name;
  }

  disableCourseNameEditing(): void {
    this.courseNameEditing = !this.courseNameEditing;
    this.course.Name = this.oldCourseName;
  }

  saveChanges(course: Course): void {
    if (this.oldCourseName !== course.Name) {
      this.updateCourseName(course);
    } else {
      this.courseNameEditing = !this.courseNameEditing;
      console.log("Update not necessary.");
    }
  }

  deleteCourse(id: number): void {
    let confirmation = window.confirm("Are you sure you want to delete this course?");

    if (confirmation === true) {
      this.isRequestProcessing = true;
      this.dataService.deleteItem<Course>(this.API_COURSE_PATH, id)
        .delay(this.RESPONSE_DELAY_TIMER)
        .subscribe(data => {
          console.log(data);
          this.isRequestProcessing = false;
          this.router.navigate(["app/courses"]);
        },
        (e: HttpErrorResponse) => {
          this.printErrorMessageToConsole(e);
          this.isRequestProcessing = false;
        });
    } else {
      console.log(`Deletion for course ID ${id} has been cancelled`);
    }
  }

  goBack(): void {
    this.location.back();
  }

  private printErrorMessageToConsole(e: HttpErrorResponse): void {
    if (e.error instanceof Error) {
      console.error("An error occurred: ", e.error.message);
    } else {
      console.error(`Backend returned status code ${e.status} and body: ${JSON.stringify(e.error)}`);
    }
  }
}
