import { isPlatformServer } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RestService {

  private cache: Map<string, any>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    @Inject(REQUEST) private request: any,
    private http: HttpClient,
  ) {
    this.cache = new Map<string, any>();
  }

  public hasSession(): boolean {
    // tslint:disable-next-line: no-string-literal
    return this.request.headers && this.request.headers['cookie'] && this.request.headers['cookie'].indexOf('SESSION') >= 0;
  }

  public get<T>(url: string, options: any = {}, cache = true): Observable<T> {
    const request = JSON.stringify({ url, options });
    if (this.cache.has(request)) {
      return of(this.cache.get(request));
    }
    // tslint:disable-next-line:no-shadowed-variable
    return this.processRequest<T>(url, options, (url: string, options: any): any => {
      return this.http.get<T>(url, options);
    }).pipe(
      tap((response: T) => {
        if (cache) {
          this.cache.set(request, response);
        }
      })
    );
  }

  public post<T>(url: string, body: any = {}, options: any = {}): Observable<T> {
    // tslint:disable-next-line:no-shadowed-variable
    return this.processRequestWithData<T>(url, body, options, (url: string, body: any, options: any): any => {
      return this.http.post<T>(url, body, options);
    });
  }

  public put<T>(url: string, body: any = {}, options: any = {}): Observable<T> {
    // tslint:disable-next-line:no-shadowed-variable
    return this.processRequestWithData<T>(url, body, options, (url: string, body: any, options: any): any => {
      return this.http.put<T>(url, body, options);
    });
  }

  public patch<T>(url: string, body: any = {}, options: any = {}): Observable<T> {
    // tslint:disable-next-line:no-shadowed-variable
    return this.processRequestWithData<T>(url, body, options, (url: string, body: any, options: any): any => {
      return this.http.patch<T>(url, body, options);
    });
  }

  public delete<T>(url: string, options: any = {}): Observable<T> {
    // tslint:disable-next-line:no-shadowed-variable
    return this.processRequest<T>(url, options, (url: string, options: any): any => {
      return this.http.delete<T>(url, options);
    });
  }

  private processRequest<T>(url: string, options: any, callback: (url: string, options: any) => Observable<T>) {
    this.preProcessOptions(options);
    return callback(url, options).pipe(
      map((response: T) => {
        return response;
      })
    );
  }

  private processRequestWithData<T>(url: string, body: any, options: any, callback: (url: string, body: any, options: any) => Observable<T>) {
    this.preProcessOptions(options);
    return callback(url, body, options).pipe(
      map((response: T) => {
        return response;
      })
    );
  }

  private preProcessOptions(options: any): void {
    if (this.useSession()) {
      if (!options.headers) {
        options.headers = new HttpHeaders({
          // tslint:disable-next-line: no-string-literal
          cookie: this.request.headers['cookie'],
        });
      } else {
        // tslint:disable-next-line: no-string-literal
        options.headers = (options.headers as HttpHeaders).set('cookie', this.request.headers['cookie']);
      }
    }
  }

  private useSession(): boolean {
    return isPlatformServer(this.platformId) && this.hasSession();
  }

}
