import { Inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public baseUrl: any;
  constructor(private httpClient: HttpClient, private router: Router, private titleService: Title, private login: LoginService) {
    this.baseUrl = environment.apiUrl;
  }

  canActivate(): boolean {
    if (this.login.getSessionData('session_id') === null) {
      return true;
    } else {
      this.router.navigate(['dashboard']);
      return false;
    }
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  public async form_action(obj: any, method: any) {
    return new Promise(resolve => {
      this.httpClient.post(this.baseUrl + method, obj).subscribe((res: any) => {
        if (res.status == true) {
          resolve(res);
        } else {
          resolve(res);
        }
      }, err => {
        resolve('Opps! There is something went wrong!');
      });
    });
  }

  public async update_action(obj: any, method: any) {
    return new Promise(resolve => {
      this.httpClient.put(this.baseUrl + method, obj).subscribe((res: any) => {
        if (res.status == true) {
          resolve(res);
        } else {
          resolve(res);
        }
      }, err => {
        resolve('Opps! There is something went wrong!');
      });
    });
  }

  form_actions_advanced(formData: any, method: any): Observable<any> {
    return this.httpClient.post(this.baseUrl + method, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.errorMgmt)
    );
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  public async delete_action(method: any) {
    return new Promise(resolve => {
      this.httpClient.delete(this.baseUrl + method).subscribe((res: any) => {
        if (res.status == true) {
          resolve(res);
        } else {
          resolve(res);
        }
      }, err => {
        resolve('Opps! There is something went wrong!');
      });
    });
  }

  public async get_action(obj: any, method: any) {
    return new Promise(resolve => {
      this.httpClient.get(this.baseUrl + method, obj).subscribe((res: any) => {
        if (res.status == true) {
          resolve(res);
        } else {
          resolve(res);
        }
      }, err => {
        resolve('Opps! There is something went wrong!');
      });
    });
  }

  _gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}
