import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { ActivatedRoute, Params, Router } from "@angular/router";

import { Course } from "app/models/course";
import { Student } from "app/models/student";
import { DataService } from "app/services/data.service";
import { InlineEditComponent } from "app/inline-edit/inline-edit.component";

import { delay, switchMap } from "rxjs/operators";

enum SAVING_STATE {
  NOT_STARTED,
  PENDING,
  SUCCESSFUL,
  FAILURE,
  FINISHED
}

type SAVING_INFORMATION = {
  status: SAVING_STATE,
  text: string
};

@Component({
  selector: "app-course-detail",
  templateUrl: "./course-detail.component.html",
  styleUrls: ["./course-detail.component.css"]
})

export class CourseDetailComponent implements OnInit {

  private API_COURSE_PATH = "courses";
  private RESPONSE_DELAY_TIMER = 1000;
  private BADGE_DELAY_TIMER = 2000;

  course: Course = new Course("");
  students: Student[];
  studentTableColumns = [
    { title: "#" },
    { title: "First name" },
    { title: "Last name" }
  ];
  isRequestProcessing = false;
  savingInfo: SAVING_INFORMATION = { status: SAVING_STATE.NOT_STARTED, text: "" };
  previousCourseName: string = "";

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
        this.retrievePreviousName();
      },
        (e: HttpErrorResponse) => {
          this.printErrorMessageToConsole(e);
          this.isRequestProcessing = false;
        });
  }

  updateCourseName(course: Course): void {
    this.savingInfo = { status: SAVING_STATE.PENDING, text: "SAVING..." };
    this.isRequestProcessing = true;
    this.dataService.updateItem<Course>(this.API_COURSE_PATH, course.Id, course)
      .pipe(delay(this.RESPONSE_DELAY_TIMER))
      .subscribe(result => {
        this.savingInfo = { status: SAVING_STATE.SUCCESSFUL, text: "SAVED!" };
        this.retrievePreviousName();
      },
        (e: HttpErrorResponse) => {
          this.isRequestProcessing = false;
          this.savingInfo = { status: SAVING_STATE.FAILURE, text: "ERROR!" };
          this.printErrorMessageToConsole(e);
          this.restorePreviousName();
          this.hideStatusBadge();
        },
        () => {
          this.isRequestProcessing = false;
          this.hideStatusBadge();
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

  getBadgeCssClass(): string {
    if (this.savingInfo.status === SAVING_STATE.PENDING) {
      return "badge badge-primary";
    } else if (this.savingInfo.status === SAVING_STATE.SUCCESSFUL) {
      return "badge badge-success";
    } else if (this.savingInfo.status === SAVING_STATE.FAILURE) {
      return "badge badge-danger";
    } else if (this.savingInfo.status === SAVING_STATE.NOT_STARTED || this.savingInfo.status === SAVING_STATE.FINISHED) {
      return "";
    }
  }

  private hideStatusBadge(): void {
    setTimeout(() => {
      this.savingInfo = { status: SAVING_STATE.FINISHED, text: "" };
    }, this.BADGE_DELAY_TIMER);
  }

  private restorePreviousName(): void {
    this.course.Name = this.previousCourseName;
  }

  private retrievePreviousName(): void {
    this.previousCourseName = this.course.Name;
  }

  private printErrorMessageToConsole(e: HttpErrorResponse): void {
    if (e.error instanceof Error) {
      console.error(`App: An error occurred: ${e.error.message}`);
    } else {
      console.error(`App: Backend returned status code ${e.status} and body: ${JSON.stringify(e.error)}`);
    }
  }
}
