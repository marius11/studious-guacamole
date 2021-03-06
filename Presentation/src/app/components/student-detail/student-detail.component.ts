import { Component, OnInit } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { StudentService } from "app/services/student.service";
import { Course } from "app/models/course";
import { Student } from "app/models/student";

import { forkJoin as observableForkJoin, Observable } from "rxjs";
import { delay, debounceTime, distinctUntilChanged, map } from "rxjs/operators";

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
  private NAME_MIN_LENGTH = 2;
  private NAME_MAX_LENGTH = 64;

  private isInputRedundant = false;
  private editStudentModalInstance: any;
  private assignCourseToStudentModalInstance: any;
  editStudentFormGroup: any;

  student: Student = new Student("", "");
  courses: Course[] = [];
  availableCourses: Course[] = [];
  selectedCourse: Course;
  courseTableColumns = [
    { title: "#" },
    { title: "Name" },
    { title: "Actions" }
  ];
  studentOldName = ["", ""];
  isRequestProcessing = false;
  studentEnrollment = true;

  filterCourses = (term: Observable<string>) => term.pipe(
    debounceTime(250),
    distinctUntilChanged(),
    map(c => c.length < 2 ? [] : this.availableCourses
      .filter(v => v.Name.toLowerCase()
        .indexOf(c.toLowerCase()) > -1)
      .slice(0, 10)
    )
  )
  resultFormatter = (x: { Id: number, Name: string }) => `#${x.Id} ${x.Name}`;
  inputFormatter = (x: { Name: string }) => x.Name;

  constructor(
    private studentService: StudentService, private route: ActivatedRoute, private modalService: NgbModal,
    private formBuilder: FormBuilder, private router: Router) {
    this.createEditStudentFormGroup();
  }

  ngOnInit(): void {
    this.getStudentDetails(this.studentEnrollment);
  }

  getStudentDetails(enrolled: boolean): void {
    this.isRequestProcessing = true;
    this.route.params.subscribe(params => {
      let studentApiCall = this.studentService.getStudentById(+params["id"]);
      let studentCoursesApiCall = this.studentService.getCoursesByStudentId(+params["id"], this.studentEnrollment);

      observableForkJoin([studentApiCall, studentCoursesApiCall])
        .pipe(delay(this.RESPONSE_DELAY_TIMER))
        .subscribe(result => {
          this.student = result[MODEL_DATA.STUDENT];
          this.courses = result[MODEL_DATA.COURSE];
          this.retrieveCurrentName();
          this.isRequestProcessing = false;
        },
          (e: HttpErrorResponse) => {
            this.printErrorMessageToConsole(e);
            this.isRequestProcessing = false;
          },
          () => {
            this.isRequestProcessing = false;
          });
    });
  }

  updateStudent(student: Student): void {
    if (this.isInputRedundant === false) {
      this.isRequestProcessing = true;
      this.studentService.updateStudent(student.Id, student)
        .pipe(delay(this.RESPONSE_DELAY_TIMER))
        .subscribe(result => {
          this.retrieveCurrentName();
          this.closeEditStudentModal();
        },
          (e: HttpErrorResponse) => {
            this.printErrorMessageToConsole(e);
          },
          () => {
            this.isRequestProcessing = false;
          });
    } else {
      this.closeEditStudentModal();
    }
  }

  addCourseToStudent(course: Course, student: Student): void {
    this.isRequestProcessing = true;
    this.studentService.addCourseToStudent(course, student.Id)
      .pipe(delay(this.RESPONSE_DELAY_TIMER))
      .subscribe(result => {
        this.closeAssignCourseToStudentModal();
        this.getStudentCoursesById(student.Id);
        this.isRequestProcessing = false;
      },
        (e: HttpErrorResponse) => {
          this.printErrorMessageToConsole(e);
          this.isRequestProcessing = false;
        },
        () => {
          this.isRequestProcessing = false;
        }
      );
  }

  private getStudentAvailableCourses(id: number): void {
    this.isRequestProcessing = true;
    this.studentService.getCoursesByStudentId(id, !this.studentEnrollment)
      .pipe(delay(this.RESPONSE_DELAY_TIMER))
      .subscribe(result => {
        this.availableCourses = result;
      },
        (e: HttpErrorResponse) => {
          this.printErrorMessageToConsole(e);
        },
        () => {
          this.isRequestProcessing = false;
        });
  }

  private getStudentCoursesById(id: number): void {
    this.isRequestProcessing = true;
    this.studentService.getCoursesByStudentId(id, this.studentEnrollment)
      .pipe(delay(this.RESPONSE_DELAY_TIMER))
      .subscribe(result => {
        this.courses = result;
        this.isRequestProcessing = false;
      },
        (e: HttpErrorResponse) => {
          this.printErrorMessageToConsole(e);
          this.isRequestProcessing = false;
        },
        () => {
          this.isRequestProcessing = false;
        });
  }

  deleteCourseFromStudent(course: Course, studentId: number) {
    this.isRequestProcessing = true;
    this.studentService.deleteCourseFromStudent(course, studentId)
      .pipe(delay(this.RESPONSE_DELAY_TIMER))
      .subscribe(result => {
        this.isRequestProcessing = false;
        this.getStudentCoursesById(studentId);
      },
        (e: HttpErrorResponse) => {
          this.printErrorMessageToConsole(e);
          this.isRequestProcessing = false;
        },
        () => {
          this.isRequestProcessing = false;
        });
  }

  openEditStudentModal(modal): void {
    this.editStudentModalInstance = this.modalService.open(modal,
      { size: "lg", backdrop: "static", keyboard: false });

    this.retrieveCurrentName();
  }

  closeEditStudentModal(): void {
    this.editStudentModalInstance.dismiss();
    this.restoreToPreviousName();
  }

  openAssignCourseToStudentModal(modal): void {
    this.assignCourseToStudentModalInstance = this.modalService.open(modal,
      { size: "lg", backdrop: "static", keyboard: false });

    this.getStudentAvailableCourses(this.student.Id);
  }

  closeAssignCourseToStudentModal(): void {
    this.assignCourseToStudentModalInstance.dismiss();
    this.selectedCourse = null;
  }

  goToCourseDetails(course: Course): void {
    this.router.navigate(["courses", course.Id]);
  }

  goToListOfStudents(): void {
    this.router.navigate(["students"]);
  }

  private createEditStudentFormGroup(): void {
    this.editStudentFormGroup = this.formBuilder.group({
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

    this.editStudentFormGroup.valueChanges.subscribe(data => {
      this.isInputRedundant =
        this.studentOldName[STUDENT_DATA.FIRST_NAME] === data.FirstName
          && this.studentOldName[STUDENT_DATA.LAST_NAME] === data.LastName ? true : false;
    });
  }

  private retrieveCurrentName(): void {
    this.studentOldName = [this.student.FirstName, this.student.LastName];
  }

  private restoreToPreviousName(): void {
    [this.student.FirstName, this.student.LastName] = this.studentOldName;
  }

  private printErrorMessageToConsole(e: HttpErrorResponse): void {
    if (e.error instanceof Error) {
      console.error(`App: An error occurred: ${e.error.message}`);
    } else {
      console.error(`App: Backend returned status code ${e.status} and body: ${JSON.stringify(e.error)}`);
    }
  }
}
