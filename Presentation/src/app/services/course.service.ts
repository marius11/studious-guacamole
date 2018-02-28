import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

import { DataService } from "./data.service";
import { DataModel } from "app/models/data-model";
import { Course } from "app/models/course";

@Injectable()
export class CourseService extends DataService {

  private API_COURSE_PATH = "courses";

  constructor(http: HttpClient) {
    super(http);
  }

  getCoursesPaged(page: number, per_page: number): Observable<DataModel<Course[]>> {
    return this.getItemsPaged(this.API_COURSE_PATH, page, per_page);
  }

  getCourseById(id: number): Observable<Course> {
    return this.getItemById(this.API_COURSE_PATH, id);
  }

  createCourse(course: Course): Observable<Course> {
    return this.createItem(this.API_COURSE_PATH, course);
  }

  updateCourse(id: number, course: Course): Observable<Course> {
    return this.updateItem(this.API_COURSE_PATH, id, course);
  }

  deleteCourse(id: number): Observable<Course> {
    return this.deleteItem(this.API_COURSE_PATH, id);
  }
}
