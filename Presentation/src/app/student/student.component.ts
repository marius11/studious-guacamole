import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

import { Student } from "app/models/student";
import { DataModel } from "app/models/data-model";
import { DataService } from "app/services/data.service";
import { SearchService } from "app/services/search.service";

import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/delay";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";

@Component({
  selector: "app-student",
  templateUrl: "./student.component.html",
  styleUrls: ["./student.component.css"]
})

export class StudentComponent implements OnInit {

  private API_STUDENT_PATH = "students";
  private RESPONSE_DELAY_TIMER = 1000;

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

  constructor(private router: Router, private dataService: DataService, private searchService: SearchService) {
    this.searchTerm
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(term => this.searchStudents(term));
  }

  ngOnInit(): void {
    this.getStudentsPaged(this.page, this.perPage);
  }

  getStudentsPaged(page: number, per_page: number): void {
    this.dataService.getItemsPaged<Student[]>(this.API_STUDENT_PATH, page, per_page)
      .delay(this.RESPONSE_DELAY_TIMER)
      .subscribe(result => {
        this.students = result;
      },
      (e: HttpErrorResponse) => {
        this.printErrorMessageToConsole(e);
      });
  }

  searchStudents(term: string): void {
    if (term.length !== 0) {
      this.searchService.getItemsFiltered<Student[]>(this.API_STUDENT_PATH, term, this.perPage)
        .subscribe(result => {
          this.students = result;
        },
        (e: HttpErrorResponse) => {
          this.printErrorMessageToConsole(e);
        });
    } else {
      this.getStudentsPaged(this.page, this.perPage);
    }
  }

  goToStudentDetails(student: Student): void {
    this.router.navigate(["app/students", student.Id]);
  }

  private printErrorMessageToConsole(e: HttpErrorResponse): void {
    if (e.error instanceof Error) {
      console.error("An error occurred: ", e.error.message);
    } else {
      console.error(`Backend returned status code ${e.status} and body: ${JSON.stringify(e.error)}`);
    }
  }
}
