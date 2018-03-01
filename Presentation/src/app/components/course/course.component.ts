import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { Course } from "app/models/course";
import { DataModel } from "app/models/data-model";
import { CourseService } from "app/services/course.service";
import { SearchService } from "app/services/search.service";

import { Subject } from "rxjs/Subject";
import { delay, debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "app-course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"]
})

export class CourseComponent implements OnInit {

  private API_COURSE_PATH = "courses";
  private RESPONSE_DELAY_TIMER = 0;
  private DEBOUNCE_TIMER = 500;
  private COURSE_NAME_MIN_LENGTH = 3;
  private COURSE_NAME_MAX_LENGTH = 128;

  private addCourseModalInstance: any;

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

  addCourseFormGroup: FormGroup;

  constructor(
    private router: Router, private courseService: CourseService, private searchService: SearchService,
    private modalService: NgbModal, private formBuilder: FormBuilder) {
    this.searchTerm
      .pipe(debounceTime(this.DEBOUNCE_TIMER), distinctUntilChanged())
      .subscribe(term => this.searchCourses(term));
  }

  ngOnInit(): void {
    this.getCoursesPaged(this.page, this.perPage);
    this.createAddCourseFormGroup();
  }

  getCoursesPaged(page: number, per_page: number): void {
    this.isRequestProcessing = true;
    this.courseService.getCoursesPaged(page, per_page)
      .pipe(delay(this.RESPONSE_DELAY_TIMER))
      .subscribe(result => {
        this.courses = result;
      },
      (e: HttpErrorResponse) => {
        this.printErrorMessageToConsole(e);
      },
      () => {
        this.isRequestProcessing = false;
      });
  }

  addCourse(course: Course): void {
    this.isRequestProcessing = true;
    this.courseService.createCourse(course)
      .pipe(delay(this.RESPONSE_DELAY_TIMER))
      .subscribe(result => {
        this.closeAddCourseModal();
        this.goToCourseDetails(result);
      },
      (e: HttpErrorResponse) => {
        this.printErrorMessageToConsole(e);
      },
      () => {
        this.isRequestProcessing = false;
      });
  }

  private searchCourses(term: string): void {
    if (term.length !== 0) {
      this.searchService.getItemsFiltered<Course[]>(this.API_COURSE_PATH, term, this.perPage)
        .subscribe(result => {
          this.courses = result;
          this.page = 1;
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

  openAddCourseModal(modal): void {
    this.addCourseModalInstance = this.modalService.open(modal, { size: "lg", backdrop: "static" });
  }

  private closeAddCourseModal(): void {
    this.addCourseModalInstance.dismiss();
  }

  private createAddCourseFormGroup(): void {
    this.addCourseFormGroup = this.formBuilder.group({
      Name: new FormControl("", [
        Validators.required,
        Validators.minLength(this.COURSE_NAME_MIN_LENGTH),
        Validators.maxLength(this.COURSE_NAME_MAX_LENGTH)
      ])
    });
  }

  private printErrorMessageToConsole(e: HttpErrorResponse): void {
    if (e.error instanceof Error) {
      console.error(`App: An error occurred: ${e.error.message}`);
    } else {
      console.error(`App: Backend returned status code ${e.status} and body: ${JSON.stringify(e.error)}`);
    }
  }
}
