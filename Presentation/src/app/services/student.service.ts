import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Rx";

import { Student } from "app/models/student";
import { Course } from "app/models/course";

@Injectable()
export class StudentService {

  constructor(private http: HttpClient) { }

  private API_BASE_URL = "http://localhost:54617/api";
  private API_STUDENT_URL = `${this.API_BASE_URL}/students`;

  getStudentsPaged(page: number, per_page: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.API_STUDENT_URL}`, {
      params: new HttpParams().set("page", `${page}`).set("per_page", `${per_page}`)
    });
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.API_STUDENT_URL}/${id}`);
  }

  getCoursesByStudentId(id: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.API_STUDENT_URL}/${id}/courses`);
  }

  createStudent(body: Student): Observable<Student> {
    return this.http.post<Student>(this.API_STUDENT_URL, JSON.stringify(body), {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    });
  }

  updateStudent(id: number, body: any): Observable<Student> {
    return this.http.put<Student>(`${this.API_STUDENT_URL}/${id}`, JSON.stringify(body), {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    });
  }

  deleteStudent(id: number): Observable<Student> {
    return this.http.delete<Student>(`${this.API_STUDENT_URL}/${id}`);
  }
}
