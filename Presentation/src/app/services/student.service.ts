import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";

import { Student } from "../models/student";
import { Course } from "../models/course";

@Injectable()
export class StudentService {

  private headers: Headers;
  private options: RequestOptions;

  constructor(private http: Http) {
    this.headers = new Headers({ "Content-Type": "application/json" });
    this.options = new RequestOptions({ headers: this.headers });
  }

  private API_BASE_URL = "http://localhost:54617/api";
  private API_STUDENT_URL = `${this.API_BASE_URL}/students`;

  getAllStudents(): Observable<Student[]> {
    return this.http.get(this.API_STUDENT_URL)
      .map((response: Response) => response.json());
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get(`${this.API_STUDENT_URL}/${id}`)
      .map((response: Response) => response.json());
  }

  getCoursesByStudentId(id: number): Observable<Course[]> {
    return this.http.get(`${this.API_STUDENT_URL}/${id}/courses`)
      .map((response: Response) => response.json());
  }

  createStudent(body: Student): Observable<Student> {
    return this.http.post(this.API_STUDENT_URL, JSON.stringify(body))
      .map((response: Response) => response.json());
  }

  updateStudent(id: number, body: any): Observable<Student> {
    return this.http.put(`${this.API_STUDENT_URL}/${id}`, JSON.stringify(body), this.options)
      .map((response: Response) => response.json());
  }

  deleteStudent(id: number): Observable<Student> {
    return this.http.delete(`${this.API_STUDENT_URL}/${id}`)
      .map((response: Response) => response.json());
  }
}
