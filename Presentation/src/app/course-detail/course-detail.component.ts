import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { ActivatedRoute, Params, Router } from "@angular/router";

import { Course } from "app/models/course";
import { Student } from "app/models/student";
import { DataService } from "app/services/data.service";
import { InlineEditComponent } from "app/inline-edit/inline-edit.component";

import { delay, switchMap } from "rxjs/operators";

@Component({
  selector: "app-course-detail",
  templateUrl: "./course-detail.component.html",
  styleUrls: ["./course-detail.component.css"]
})

export class CourseDetailComponent implements OnInit {

  private API_COURSE_PATH = "courses";
  private RESPONSE_DELAY_TIMER = 1000;

  course: Course = new Course("");
  students: Student[];
  studentTableColumns = [
    { title: "#" },
    { title: "First name" },
    { title: "Last name" }
  ];
  isRequestProcessing = false;

  constructor(private dataService: DataService, private route: ActivatedRoute, private location: Location,
    private router: Router) { }

  ngOnInit(): void {
    this.getCourseDetails();
  }

  getCourseDetails(): void {
    this.isRequestProcessing = true;
    this.route.params
      .pipe(
      switchMap((params: Params) => this.dataService.getItemById<Course>(this.API_COURSE_PATH, +params["id"])),
      delay(this.RESPONSE_DELAY_TIMER))
      .subscribe(result => {
        this.course = result;
        this.students = result.Students;
        this.isRequestProcessing = false;
      },
      (e: HttpErrorResponse) => {
        this.printErrorMessageToConsole(e);
        this.isRequestProcessing = false;
      });
  }

  updateCourseName(course: Course): void {
    this.isRequestProcessing = true;
    this.dataService.updateItem<Course>(this.API_COURSE_PATH, course.Id, course)
      .pipe(delay(this.RESPONSE_DELAY_TIMER))
      .subscribe(result => {
      },
      (e: HttpErrorResponse) => {
        this.printErrorMessageToConsole(e);
      },
      () => {
        this.isRequestProcessing = false;
      });
  }

  deleteCourse(id: number): void {
    let confirmation = window.confirm("Are you sure you want to delete this course?");

    if (confirmation === true) {
      this.isRequestProcessing = true;
      this.dataService.deleteItem<Course>(this.API_COURSE_PATH, id)
        .subscribe(data => {
          this.router.navigate(["app/courses"]);
        },
        (e: HttpErrorResponse) => {
          this.printErrorMessageToConsole(e);
        },
        () => {
          this.isRequestProcessing = false;
        });
    } else {
      console.log(`Deletion for course with the ID ${id} has been cancelled.`);
    }
  }

  goBack(): void {
    this.location.back();
  }

  private printErrorMessageToConsole(e: HttpErrorResponse): void {
    if (e.error instanceof Error) {
      console.error(`App: An error occurred: ${e.error.message}`);
    } else {
      console.error(`App: Backend returned status code ${e.status} and body: ${JSON.stringify(e.error)}`);
    }
  }
}
