import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { StudentService } from "app/services/student.service";
import { Student } from "app/models/student";
import { DataModel } from "app/models/data-model";
import { SearchService } from "app/services/search.service";

import { Subject } from "rxjs/Subject";
import { delay, debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "app-student",
  templateUrl: "./student.component.html",
  styleUrls: ["./student.component.css"]
})

export class StudentComponent implements OnInit {

  private API_STUDENT_PATH = "students";
  private RESPONSE_DELAY_TIMER = 0;
  private DEBOUNCE_TIMER = 500;
  private NAME_MIN_LENGTH = 2;
  private NAME_MAX_LENGTH = 64;

  private addStudentModalInstance: any;

  student: Student = new Student("", "");
  students: DataModel<Student[]> = { Data: [], Count: 0 };
  searchTerm = new Subject<string>();
  columns = [
    { title: "#" },
    { title: "First name" },
    { title: "Last name" }
  ];
  page = 1;
  perPage = 8;
  isRequestProcessing = false;

  addStudentFormGroup: FormGroup;

  constructor(
    private router: Router, private studentService: StudentService, private searchService: SearchService,
    private modalService: NgbModal, private formBuilder: FormBuilder) {
    this.searchTerm
      .pipe(debounceTime(this.DEBOUNCE_TIMER), distinctUntilChanged())
      .subscribe(term => this.searchStudents(term));
  }

  ngOnInit(): void {
    this.getStudentsPaged(this.page, this.perPage);
    this.createAddStudentFormGroup();
  }

  getStudentsPaged(page: number, per_page: number): void {
    this.isRequestProcessing = true;
    this.studentService.getStudentsPaged(page, per_page)
      .pipe(delay(this.RESPONSE_DELAY_TIMER))
      .subscribe(result => {
        this.students = result;
      },
      (e: HttpErrorResponse) => {
        this.printErrorMessageToConsole(e);
      },
      () => {
        this.isRequestProcessing = false;
      });
  }

  addStudent(student: Student): void {
    this.isRequestProcessing = true;
    this.studentService.createStudent(student)
      .pipe(delay(this.RESPONSE_DELAY_TIMER))
      .subscribe(result => {
        this.closeAddStudentModal();
        this.router.navigate(["app/students", result.Id]);
      },
      (e: HttpErrorResponse) => {
        this.printErrorMessageToConsole(e);
      },
      () => {
        this.isRequestProcessing = false;
      });
  }

  goToStudentDetails(student: Student): void {
    this.router.navigate(["app/students", student.Id]);
  }

  private searchStudents(term: string): void {
    if (term.length !== 0) {
      this.searchService.getItemsFiltered<Student[]>(this.API_STUDENT_PATH, term, this.perPage)
        .subscribe(result => {
          this.students = result;
          this.page = 1;
        },
        (e: HttpErrorResponse) => {
          this.printErrorMessageToConsole(e);
        });
    } else {
      this.getStudentsPaged(this.page, this.perPage);
    }
  }

  openAddStudentModal(modal): void {
    this.addStudentModalInstance = this.modalService.open(modal, { size: "lg", backdrop: "static" });
  }

  private closeAddStudentModal(): void {
    this.addStudentModalInstance.dismiss();
  }

  private createAddStudentFormGroup(): void {
    this.addStudentFormGroup = this.formBuilder.group({
      FirstName: new FormControl("", [
        Validators.required,
        Validators.minLength(this.NAME_MIN_LENGTH),
        Validators.maxLength(this.NAME_MAX_LENGTH)
      ]),
      LastName: new FormControl("", [
        Validators.required,
        Validators.minLength(this.NAME_MIN_LENGTH),
        Validators.maxLength(this.NAME_MAX_LENGTH)
      ])
    });
  }
  get FirstName() { return this.addStudentFormGroup.get("FirstName"); }
  get LastName() { return this.addStudentFormGroup.get("LastName"); }

  private printErrorMessageToConsole(e: HttpErrorResponse): void {
    if (e.error instanceof Error) {
      console.error(`App: An error occurred: ${e.error.message}`);
    } else {
      console.error(`App: Backend returned status code ${e.status} and body: ${JSON.stringify(e.error)}`);
    }
  }
}
