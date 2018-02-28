import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

import { DataModel } from "../models/data-model";
import { DataService } from "./data.service";
import { Student } from "../models/student";

@Injectable()
export class StudentService extends DataService {

  private STUDENT_API_PATH = "students";

  constructor(http: HttpClient) {
    super(http);
  }

  getStudentsPaged(page: number, per_page: number): Observable<DataModel<Student[]>> {
    return this.getItemsPaged(this.STUDENT_API_PATH, page, per_page);
  }

  getStudentById(id: number): Observable<Student> {
    return this.getItemById(this.STUDENT_API_PATH, id);
  }

  createStudent(student: Student): Observable<Student> {
    return this.createItem(this.STUDENT_API_PATH, student);
  }

  updateStudent(id: number, student: Student): Observable<Student> {
    return this.updateItem(this.STUDENT_API_PATH, id, student);
  }

  deleteStudent(id: number): Observable<Student> {
    return this.deleteItem(this.STUDENT_API_PATH, id);
  }
}
