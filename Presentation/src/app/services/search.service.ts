import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

import { DataModel } from "app/models/data-model";
import { environment } from "../../environments/environment";

@Injectable()
export class SearchService {

  private API_BASE_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getItemsFiltered<T>(path: string, search_term: string, per_page: number): Observable<DataModel<T>> {
    return this.http.get<DataModel<T>>(`${this.API_BASE_URL}/${path}`, {
      params: new HttpParams().set("search_term", `${search_term}`).set("per_page", `${per_page}`),
    });
  }
}
