import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Rx";

import { Student } from "../models/student";
import { Course } from "../models/course";

@Injectable()
export class CourseService {

  constructor(private http: HttpClient) { }

  private API_BASE_URL = "http://localhost:54617/api";
  private API_COURSE_URL = `${this.API_BASE_URL}/courses`;

  getCoursesPaged(page: number, per_page: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.API_COURSE_URL}`, {
      params: new HttpParams().set("page", `${page}`).set("per_page", `${per_page}`)
    });
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.API_COURSE_URL}/${id}`);
  }

  getStudentsByCourseId(id: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.API_COURSE_URL}/${id}/students`);
  }

  createCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(`${this.API_COURSE_URL}`, JSON.stringify(course), {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    });
  }

  updateCourseName(course: Course): Observable<Course[]> {
    return this.http.put<Course[]>(`${this.API_COURSE_URL}/${course["Id"]}`, JSON.stringify(course), {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    });
  }

  deleteCourse(id: number): Observable<Course> {
    return this.http.delete<Course>(`${this.API_COURSE_URL}/${id}`);
  }
}
