import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private injector: Injector, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const jwt = localStorage.getItem('jwt');

    if (jwt) {
      //console.log(req);
      //alert(req);
      req = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + jwt)
      });
      //console.log(req);
      //alert(req);
    }

    return next.handle(req).pipe(
      map(event => {
        if (event instanceof HttpResponse) {
          switch (event.body.Status) {
            case 1: {
              event = this.success(event);
              break;
            }
            case 0: {
              event = this.error(event);
              break;
            }
            case -1: {
              event = this.error(event);
              this.router.navigate(['/login']);
              break;
            }
          }
        }
        return event;
      })
    );
  }

  private success(event: any): any {
    if (event.body.Data) {
      return event.clone({ body: event.body.Data });
    } else {
      return event.clone({ body: true });
    }

  }

  private error(event: any): any {
    alert(event.body.Message);

    return event.clone({ body: false });
  }

}
