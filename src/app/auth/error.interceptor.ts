import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
  HttpStatusCode
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {throwError} from 'rxjs';
import { AppService } from 'shared/AppService';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private appService: AppService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      tap(evt => {
        if (evt instanceof HttpResponse) {
          console.log(evt.status);
        }
      }),
      catchError((error: HttpErrorResponse ) => {

        if(error.status === HttpStatusCode.Forbidden){
          this.appService.forbiddenAction();
        }

        if(error.status === HttpStatusCode.Unauthorized){
          this.appService.logout()
        }
        return throwError(error);
      })
    );
  }
}
