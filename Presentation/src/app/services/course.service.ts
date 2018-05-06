import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { DataService } from "app/services/data.service";
import { DataModel } from "app/models/data-model";
import { Course } from "app/models/course";
import { Student } from "app/models/student";

import { environment } from "../../environments/environment";

@Injectable()
export class CourseService extends DataService {

  private COURSE_API_RESOURCE = "courses";
  private COURSE_API_SUB_RESOURCE = "students";
  private BASE_API_PATH = `${environment.apiUrl}/${this.COURSE_API_RESOURCE}`;

  constructor(http: HttpClient) {
    super(http);
  }

  getCoursesPaged(page: number, per_page: number): Observable<DataModel<Course[]>> {
    return this.getItemsPaged(this.COURSE_API_RESOURCE, page, per_page);
  }

  getCourseById(id: number): Observable<Course> {
    return this.getItemById(this.COURSE_API_RESOURCE, id);
  }

  getStudentsByCourseId(id: number) {
    return this.http.get<Student[]>(`${this.BASE_API_PATH}/${id}/${this.COURSE_API_SUB_RESOURCE}`);
  }

  addCourse(course: Course): Observable<Course> {
    return this.addItem(this.COURSE_API_RESOURCE, course);
  }

  updateCourse(id: number, course: Course): Observable<Course> {
    return this.updateItem(this.COURSE_API_RESOURCE, id, course);
  }

  deleteCourse(id: number): Observable<Course> {
    return this.deleteItem(this.COURSE_API_RESOURCE, id);
  }
}
