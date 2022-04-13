import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";

@Injectable()
export class NotFoundInterceptor implements HttpInterceptor {

  constructor(private router: Router, private loader: NgxSpinnerService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return <any>next.handle(request).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 404) {
        this.loader.hide();
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: error.error.message,
          timer: 1500
        });
        setTimeout(() => {
          this.router.navigate(['/not-found']);
        });
      }
      return throwError(error);
    }));
  }
}
