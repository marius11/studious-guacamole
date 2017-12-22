import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { Course } from "app/models/course";
import { CourseService } from "app/services/course.service";

@Component({
  selector: "app-course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"]
})

export class CourseComponent implements OnInit {

  course: Course = new Course("");
  courses: Course[] = [];
  columns = [
    { title: "#" },
    { title: "Name" }
  ];
  page = 1;
  perPage = 8;

  constructor(
    private router: Router,
    private courseService: CourseService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getCoursesPaged(this.page, this.perPage);
  }

  getCoursesPaged(page: number, per_page: number): void {
    this.courseService.getCoursesPaged(page, per_page)
      .subscribe(result => {
        this.courses = result;
      },
      (e: HttpErrorResponse) => {
        this.printErrorMessageToConsole(e);
      });
  }

  addCourse(course: Course): void {
    this.courseService.createCourse(course)
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
    console.error(`Error: ${e.error} | Name: ${e.name} | Message: ${e.message} | Status: ${e.status}`);
  }
}
