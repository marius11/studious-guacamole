import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { Course } from "app/models/course";
import { Student } from "app/models/student";
import { DataService } from "app/services/data.service";

import { Observable } from "rxjs/Observable";
import { delay } from "rxjs/operators";
import "rxjs/add/observable/forkJoin";

enum MODEL_DATA {
  STUDENT,
  COURSE
}

enum STUDENT_DATA {
  FIRST_NAME,
  LAST_NAME
}

@Component({
  selector: "app-student-detail",
  templateUrl: "./student-detail.component.html",
  styleUrls: ["./student-detail.component.css"]
})

export class StudentDetailComponent implements OnInit {

  private API_STUDENT_PATH = "students";
  private API_STUDENT_SUB_PATH = "courses";
  private RESPONSE_DELAY_TIMER = 1000;
  private editStudentModalInstance: any;
  editStudentFormGroup: any;

  student: Student = new Student("", "");
  courses: Course[] = [];
  courseTableColumns = [
    { title: "#" },
    { title: "Name" }
  ];
  studentOldName = ["", ""];
  isInputRedundant = false;
  isRequestProcessing = false;

  constructor(
    private dataService: DataService, private route: ActivatedRoute, private location: Location,
    private modalService: NgbModal, private formBuilder: FormBuilder) {
    this.createEditStudentFormGroup();
  }

  ngOnInit(): void {
    this.getStudentDetails();
  }

  getStudentDetails(): void {
    this.isRequestProcessing = true;
    this.route.params.subscribe(params => {
      let studentApiCall = this.dataService.getItemById<Student>(this.API_STUDENT_PATH, +params["id"]);
      let studentCoursesApiCall = this.dataService.getSubItemByItemId<Course[]>(
        this.API_STUDENT_PATH, +params["id"], this.API_STUDENT_SUB_PATH);

      Observable.forkJoin([studentApiCall, studentCoursesApiCall])
        .pipe(delay(this.RESPONSE_DELAY_TIMER))
        .subscribe(result => {
          this.student = result[MODEL_DATA.STUDENT];
          this.courses = result[MODEL_DATA.COURSE];
          this.studentOldName = [this.student.FirstName, this.student.LastName];
        },
        (e: HttpErrorResponse) => {
          this.printErrorMessageToConsole(e);
        },
        () => {
          this.isRequestProcessing = false;
        });
    });
  }

  updateStudent(student: Student): void {
    this.isRequestProcessing = true;
    this.dataService.updateItem<Student>(this.API_STUDENT_PATH, student.Id, student)
      .pipe(delay(this.RESPONSE_DELAY_TIMER))
      .subscribe(result => {
        this.closeEditStudentModal();
        this.studentOldName = [student.FirstName, student.LastName];
      },
      (e: HttpErrorResponse) => {
        this.printErrorMessageToConsole(e);
      },
      () => {
        this.isRequestProcessing = false;
      });
  }

  goBack(): void {
    this.location.back();
  }

  openEditStudentModal(modal): void {
    this.editStudentModalInstance = this.modalService.open(modal, { size: "lg", backdrop: "static" });
  }

  private closeEditStudentModal(): void {
    this.editStudentModalInstance.dismiss();
  }

  private createEditStudentFormGroup(): void {
    this.editStudentFormGroup = this.formBuilder.group({
      FirstName: new FormControl("", [Validators.required, Validators.minLength(2)]),
      LastName: new FormControl("", [Validators.required, Validators.minLength(2)])
    });

    this.editStudentFormGroup.valueChanges.subscribe(data => {
      this.isInputRedundant =
        this.studentOldName[STUDENT_DATA.FIRST_NAME] === data.FirstName
          && this.studentOldName[STUDENT_DATA.LAST_NAME] === data.LastName ? true : false;
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
