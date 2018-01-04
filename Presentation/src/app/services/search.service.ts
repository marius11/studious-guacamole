import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

import { DataModel } from "app/models/data-model";

import { Observable } from "rxjs/Observable";

@Injectable()
export class SearchService {

  private API_BASE_URL = "http://localhost:54617/api";

  constructor(private http: HttpClient) { }

  getItemsFiltered<T>(path: string, search_term: string, per_page: number): Observable<DataModel<T>> {
    return this.http.get<DataModel<T>>(`${this.API_BASE_URL}/${path}`, {
      params: new HttpParams().set("search_term", `${search_term}`).set("per_page", `${per_page}`),
    });
  }
}
