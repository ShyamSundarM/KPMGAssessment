import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.headers.has('noToken')) return next.handle(request);
    else {
      let jwt = localStorage.getItem('token');
      return next.handle(
        request.clone({ setHeaders: { Authorization: `Bearer ${jwt}` } })
      );
    }
  }
}
