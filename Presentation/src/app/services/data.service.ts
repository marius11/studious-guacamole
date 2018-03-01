import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { DataModel } from "app/models/data-model";

@Injectable()
export class DataService {

  private API_BASE_URL = "http://localhost:54617/api";

  constructor(protected http: HttpClient) { }

  getItemsPaged<T>(path: string, page: number, per_page: number): Observable<DataModel<T>> {
    return this.http.get<DataModel<T>>(`${this.API_BASE_URL}/${path}`, {
      params: new HttpParams().set("page", `${page}`).set("per_page", `${per_page}`),
    });
  }

  getItemById<T>(path: string, id: number): Observable<T> {
    return this.http.get<T>(`${this.API_BASE_URL}/${path}/${id}`);
  }

  getSubItemByItemId<T>(path: string, id: number, sub_path: string): Observable<T> {
    return this.http.get<T>(`${this.API_BASE_URL}/${path}/${id}/${sub_path}`);
  }

  createItem<T>(path: string, item: T): Observable<T> {
    return this.http.post<T>(`${this.API_BASE_URL}/${path}`, JSON.stringify(item), {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    });
  }

  assignItem<T>(path: string, sub_path: string, id: number, item: any): Observable<T> {
    return this.http.post<T>(`${this.API_BASE_URL}/${path}/${id}/${sub_path}`, JSON.stringify(item), {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    });
  }

  updateItem<T>(path: string, id: number, item: T): Observable<T> {
    return this.http.put<T>(`${this.API_BASE_URL}/${path}/${id}`, JSON.stringify(item), {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    });
  }

  deleteItem<T>(path: string, id: number): Observable<T> {
    return this.http.delete<T>(`${this.API_BASE_URL}/${path}/${id}`);
  }
}
