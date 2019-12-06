import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
  HttpParams,
  HttpErrorResponse,
  HttpEvent
} from "@angular/common/http";
import { throwError, Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { BASE_API } from "../../constants/api/index";
import { CURRENT_USER } from "../../constants/localStorageKey/index";
import { CommonService } from "../method/index";

@Injectable({
  providedIn: "root"
})
export class AppService {
  myAppUrl = "";
  headers: any;
  constructor(private http: HttpClient, private commonService: CommonService) {
    this.myAppUrl = BASE_API;
  }

  get(url: string, onError: () => void, param?: any) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem(CURRENT_USER)).token
      }`
    });
    return this.http
      .get(`${this.myAppUrl}${url}`, { headers: this.headers, params: param })
      .pipe(
        catchError((error: any, caught: Observable<HttpEvent<any>>) => {
          this.handleError(error, caught);
          onError();
          return throwError(error);
        })
      );
  }
  post(url: string, onError: () => void, body?: any, param?: any) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem(CURRENT_USER)).token
      }`
    });
    return this.http
      .post(`${this.myAppUrl}${url}`, body, {
        headers: this.headers
      })
      .pipe(
        catchError((error: any, caught: Observable<HttpEvent<any>>) => {
          onError();
          this.handleError(error, caught);
          return throwError(error);
        })
      );
  }
  put(url: string, onError: () => void, body?: any, param?: any) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem(CURRENT_USER)).token
      }`
    });
    return this.http
      .put(`${this.myAppUrl}${url}`, body, {
        headers: this.headers,
        params: param
      })
      .pipe(
        catchError((error: any, caught: Observable<HttpEvent<any>>) => {
          onError();
          this.handleError(error, caught);
          return throwError(error);
        })
      );
  }
  delete(url: string, onError: () => void, param?: any) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem(CURRENT_USER)).token
      }`
    });
    return this.http
      .delete(`${this.myAppUrl}${url}`, {
        headers: this.headers,
        params: param
      })
      .pipe(
        catchError((error: any, caught: Observable<HttpEvent<any>>) => {
          onError();
          this.handleError(error, caught);
          return throwError(error);
        })
      );
  }
  uploadFile(url: string, onError: () => void, data: any) {
    this.headers = new HttpHeaders({
     
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem(CURRENT_USER)).token
      }`
    });
    let formData = new FormData();
    formData.append("files", data[0], data[0].name);
    return this.http
      .post(`${this.myAppUrl}${url}`, formData, {
        headers: this.headers
      })
      .pipe(
        catchError((error: any, caught: Observable<HttpEvent<any>>) => {
          onError();
          this.handleError(error, caught);
          return throwError(error);
        })
      );
  }
  private handleError(error: HttpErrorResponse, caught) {
    this.commonService.handleError(error.status);
  }
}
