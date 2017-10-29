import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Student } from "../models/student";
import { Course } from "../models/course";
import { Observable } from "rxjs/Rx";

import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

@Injectable()
export class StudentService {

  constructor(private http: Http) { }
  private studentsApiUrl = "http://localhost:54617/api/students";

  getAllStudents(): Observable<Student[]> {
    return this.http.get(this.studentsApiUrl)
    .map((response: Response) => response.json())
    .catch((error: any) => Observable.throw(error.json()));
  }
  getStudentById(id: number): Observable<Student> {
    return this.http.get(`${this.studentsApiUrl}/${id}`)
    .map((response: Response) => response.json())
    .catch((error: any) => Observable.throw(error.json()));
  }
  getCoursesByStudentId(id: number): Observable<Course[]> {
    return this.http.get(`${this.studentsApiUrl}/${id}/courses`)
    .map((response: Response) => response.json())
    .catch((error: any) => Observable.throw(error.json()));
  }
}
