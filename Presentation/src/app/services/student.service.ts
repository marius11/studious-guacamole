import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

import { DataModel } from "app/models/data-model";
import { DataService } from "app/services/data.service";
import { Student } from "app/models/student";
import { Course } from "app/models/course";

@Injectable()
export class StudentService extends DataService {

  private STUDENT_API_RESOURCE = "students";
  private STUDENT_API_SUB_RESOURCE = "courses";
  private BASE_API_PATH = `http://localhost:54617/api/${this.STUDENT_API_RESOURCE}`;

  constructor(http: HttpClient) {
    super(http);
  }

  getStudentsPaged(page: number, per_page: number): Observable<DataModel<Student[]>> {
    return this.getItemsPaged(this.STUDENT_API_RESOURCE, page, per_page);
  }

  getStudentById(id: number): Observable<Student> {
    return this.getItemById(this.STUDENT_API_RESOURCE, id);
  }

  getStudentCoursesById(id: number, enrolled: boolean) {
    return this.http.get<Course[]>(`${this.BASE_API_PATH}/${id}/${this.STUDENT_API_SUB_RESOURCE}`, {
      params: new HttpParams().set("enrolled", `${enrolled}`)
    });
  }

  createStudent(student: Student): Observable<Student> {
    return this.createItem(this.STUDENT_API_RESOURCE, student);
  }

  updateStudent(id: number, student: Student): Observable<Student> {
    return this.updateItem(this.STUDENT_API_RESOURCE, id, student);
  }

  deleteStudent(id: number): Observable<Student> {
    return this.deleteItem(this.STUDENT_API_RESOURCE, id);
  }
}
