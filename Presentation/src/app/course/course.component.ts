import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { Course } from "../models/course";
import { CourseService } from "../services/course.service";

@Component({
  selector: "app-course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"]
})

export class CourseComponent implements OnInit {

  private courses: Course[] = [];
  private columns = [
    { title: "#" },
    { title: "Name" }
  ];
  private page = 1;
  private perPage = 10;

  constructor(
    private courseService: CourseService,
    private router: Router,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getCoursesPaged(this.page, this.perPage);
  }

  getAllCourses(): void {
    this.courseService.getAllCourses()
      .subscribe(
      data => this.courses = data,
      error => console.log(error)
      );
  }

  getCoursesPaged(page: number, per_page: number): void {
    this.courseService.getCoursesPaged(page, per_page)
      .subscribe(
      data => this.courses = data,
      error => console.log(error)
      );
  }

  goToCourseDetails(course: Course): void {
    this.router.navigate(["demo/courses", course.Id]);
  }

  openAddCourseModal(content) {
    this.modalService.open(content);
  }
}
