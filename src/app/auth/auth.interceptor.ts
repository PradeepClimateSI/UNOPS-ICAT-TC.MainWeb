import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppService } from 'shared/AppService';
import {catchError, map} from 'rxjs/operators';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private appService: AppService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.appService.setLoading(true, req.url);
    const token = this.appService.getToken();
    if(token){
      req = req.clone({
        headers: req.headers.set('Access-Control-Allow-Origin', '*')
      });
      req = req.clone({
        headers: req.headers.set('Access-Control-Allow-Credentials', 'true')
      });
      req = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      })
    }

    return next.handle(req)
      .pipe(catchError((err) => {
        // this._loading.setLoading(false, req.url);
        return err;
      }))
      // @ts-ignore
      .pipe(map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
        if (evt instanceof HttpResponse) {
          this.appService.setLoading(false, req.url);
        }
        return evt;
      }));

    // return next.handle(req);
  }
}
