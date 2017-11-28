import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";

import { Student } from "../models/student";
import { Course } from "../models/course";

@Injectable()
export class CourseService {

  private headers: Headers;
  private options: RequestOptions;

  constructor(private http: Http) {
    this.headers = new Headers({ "Content-Type": "application/json" });
    this.options = new RequestOptions({ headers: this.headers });
  }

  private API_BASE_URL = "http://localhost:54617/api";
  private API_COURSE_URL = `${this.API_BASE_URL}/courses`;

  getAllCourses(): Observable<Course[]> {
    return this.http.get(this.API_COURSE_URL)
      .map((response: Response) => response.json());
  }

  getCoursesPaged(page: number, per_page: number): Observable<Course[]> {
    return this.http.get(`${this.API_COURSE_URL}?page=${page}&per_page=${per_page}`)
      .map((response: Response) => response.json());
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get(`${this.API_COURSE_URL}/${id}`)
      .map((response: Response) => response.json());
  }

  getStudentsByCourseId(id: number): Observable<Student[]> {
    return this.http.get(`${this.API_COURSE_URL}/${id}/students`)
      .map((response: Response) => response.json());
  }

  createCourse(body: Course): Observable<Course> {
    return this.http.post(`${this.API_COURSE_URL}`, JSON.stringify(body))
      .map((response: Response) => response.json());
  }

  updateCourseName(course: Course): Observable<Course[]> {
    return this.http.put(`${this.API_COURSE_URL}/${course["Id"]}`, JSON.stringify(course), this.options)
      .map((response: Response) => response.json());
  }

  deleteCourse(id: number): Observable<Course> {
    return this.http.delete(`${this.API_COURSE_URL}/${id}`)
      .map((response: Response) => response.json());
  }
}
