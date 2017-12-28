import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { DataModel } from "app/models/data-model";
import { DataService } from "app/services/data.service";

import { Course } from "app/models/course";

import "rxjs/add/operator/delay";

@Component({
  selector: "app-course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"]
})

export class CourseComponent implements OnInit {

  private API_COURSE_PATH = "courses";
  private RESPONSE_DELAY_TIMER = 1000;

  course: Course = new Course("");
  courses: DataModel<Course[]> = { Data: [], Count: 0 };
  columns = [
    { title: "#" },
    { title: "Name" }
  ];
  page = 1;
  perPage = 8;

  constructor(
    private router: Router,
    private dataService: DataService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getCoursesPaged(this.page, this.perPage);
  }

  getCoursesPaged(page: number, per_page: number): void {
    this.dataService.getItemsPaged<Course[]>(this.API_COURSE_PATH, page, per_page)
      .delay(this.RESPONSE_DELAY_TIMER)
      .subscribe(result => {
        this.courses = result;
      },
      (e: HttpErrorResponse) => {
        this.printErrorMessageToConsole(e);
      });
  }

  addCourse(course: Course): void {
    this.dataService.createItem<Course>(this.API_COURSE_PATH, course)
      .delay(this.RESPONSE_DELAY_TIMER)
      .subscribe(result => {
        console.log(result);
      },
      (e: HttpErrorResponse) => {
        this.printErrorMessageToConsole(e);
      });
  }

  goToCourseDetails(course: Course): void {
    this.router.navigate(["demo/courses", course.Id]);
  }

  openAddCourseModal(content) {
    this.modalService.open(content, { size: "lg", backdrop: "static" });
  }

  private printErrorMessageToConsole(e: HttpErrorResponse): void {
    if (e.error instanceof Error) {
      console.error("An error occurred: ", e.error.message);
    } else {
      console.error(`Backend returned status code ${e.status} and body: ${JSON.stringify(e.error)}`);
    }
  }
}
