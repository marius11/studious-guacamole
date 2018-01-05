import { Router } from "@angular/router";
import { FormControl } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { Course } from "app/models/course";
import { DataModel } from "app/models/data-model";

import { DataService } from "app/services/data.service";
import { SearchService } from "app/services/search.service";

import { Observable, Subscribable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

import "rxjs/add/operator/delay";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";

@Component({
  selector: "app-course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"]
})

export class CourseComponent implements OnInit {

  course: Course = new Course("");
  courses: DataModel<Course[]> = { Data: [], Count: 0 };
  searchTerm = new Subject<string>();
  columns = [
    { title: "#" },
    { title: "Name" }
  ];
  page = 1;
  perPage = 8;
  isRequestProcessing = false;

  private API_COURSE_PATH = "courses";
  private RESPONSE_DELAY_TIMER = 1000;
  private addCourseModalInstance: any;

  constructor(
    private router: Router,
    private dataService: DataService,
    private searchService: SearchService,
    private modalService: NgbModal) {

    this.searchTerm
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(term => this.searchCourses(term));
  }

  ngOnInit(): void {
    this.getCoursesPaged(this.page, this.perPage);
  }

  getCoursesPaged(page: number, per_page: number): void {
    this.dataService.getItemsPaged<Course[]>(this.API_COURSE_PATH, page, per_page)
      .delay(this.RESPONSE_DELAY_TIMER - 750)
      .subscribe(result => {
        this.courses = result;
      },
      (e: HttpErrorResponse) => {
        this.printErrorMessageToConsole(e);
      });
  }

  addCourse(course: Course): void {
    this.isRequestProcessing = true;
    this.dataService.createItem<Course>(this.API_COURSE_PATH, course)
      .delay(this.RESPONSE_DELAY_TIMER)
      .subscribe(result => {
        this.isRequestProcessing = false;
        this.closeAddCourseModal();
      },
      (e: HttpErrorResponse) => {
        this.printErrorMessageToConsole(e);
        this.isRequestProcessing = false;
      });
  }

  searchCourses(term: string): void {
    if (term.length !== 0) {
      this.searchService.getItemsFiltered<Course[]>(this.API_COURSE_PATH, term, this.perPage)
        .subscribe(result => {
          this.courses = result;
        },
        (e: HttpErrorResponse) => {
          this.printErrorMessageToConsole(e);
        });
    } else {
      this.getCoursesPaged(this.page, this.perPage);
    }
  }

  goToCourseDetails(course: Course): void {
    this.router.navigate(["app/courses", course.Id]);
  }

  openAddCourseModal(content): void {
    this.addCourseModalInstance = this.modalService.open(content, { size: "lg", backdrop: "static" });
  }

  private closeAddCourseModal(): void {
    this.addCourseModalInstance.dismiss();
  }

  private printErrorMessageToConsole(e: HttpErrorResponse): void {
    if (e.error instanceof Error) {
      console.error("An error occurred: ", e.error.message);
    } else {
      console.error(`Backend returned status code ${e.status} and body: ${JSON.stringify(e.error)}`);
    }
  }
}
