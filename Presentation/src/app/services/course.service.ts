import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Student } from "../models/student";
import { Course } from "../models/course";
import { Observable } from "rxjs/Rx";

import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

@Injectable()
export class CourseService {

  constructor(private http: Http) { }

  private coursesApiUrl = "http://localhost:54617/api/courses";

  getAllCourses(): Observable<Course[]> {
    return this.http.get(this.coursesApiUrl)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get(`${this.coursesApiUrl}/${id}`)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  getStudentsByCourseId(id: number): Observable<Student[]> {
    return this.http.get(`${this.coursesApiUrl}/${id}/students`)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }

  updateCourseName(course: Course): Observable<Course[]> {
    let body = JSON.stringify(course);
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });

    return this.http.put(`${this.coursesApiUrl}/${course["Id"]}`, body, options)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json()));
  }
}
