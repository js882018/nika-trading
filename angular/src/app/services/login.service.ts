import { Inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public baseUrl: any;
  constructor(private httpClient: HttpClient, private router: Router, private titleService: Title, private loader: NgxSpinnerService) {
    this.baseUrl = environment.apiUrl;
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    //console.log(route.data)
    if (this.getSessionData('session_id') === null || !this.getSessionData('session_id')) {
      if (route.data['page'] != 'login') {
        this.router.navigate(['login']);
        return false;
      } else {
        return true;
      }
    }
    else {
      if (route.data['page'] == 'login') {
        this.router.navigate(['dashboard']);
        return false;
      } else {
        return true;
      }
    }
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  public async doLogin(obj: any) {
    return new Promise(resolve => {
      this.httpClient.post(this.baseUrl + '/login', obj).subscribe((res: any) => {
        if (res.status == true) {
          localStorage.clear();//initially clear local storage
          this.saveSession(res.data);
          resolve(res);
        } else {
          resolve(res);
        }
      }, err => {
        resolve('Opps! There is something went wrong!');
      });
    });
  }

  public saveSession(data: any) {
    localStorage.clear();//initially
    localStorage.setItem('session_id', data.id);
    localStorage.setItem('session_name', data.name);
    localStorage.setItem('session_email', data.email);
    localStorage.setItem('session_image', data.image_url);
    localStorage.setItem('session_role', data.role);
  }

  public getSessionData(key: any) {
    const result = localStorage.getItem(key);;
    return result;
  }

  public async doLogout() {
    this.loader.hide();
    localStorage.clear();
    this.router.navigate(['login']);
  }
}