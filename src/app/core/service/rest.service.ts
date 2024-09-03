import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, makeStateKey, PLATFORM_ID, TransferState } from '@angular/core';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { APP_CONFIG, AppConfig } from '../../app.config';

export const REST_CACHE_TRANSLATE_STATE = makeStateKey<any>('REST_CACHE_TRANSLATE_STATE');

@Injectable({
  providedIn: 'root',
})
export class RestService {

  private cache: any;

  constructor(
    @Inject(APP_CONFIG) private appConfig: AppConfig,
    @Inject(PLATFORM_ID) private platformId: string,
    @Inject(REQUEST) private request: any,
    private http: HttpClient,
    private transferState: TransferState,
  ) {
    this.cache = isPlatformBrowser(this.platformId)
      ? transferState.get<any>(REST_CACHE_TRANSLATE_STATE, {})
      : {};

    transferState.remove(REST_CACHE_TRANSLATE_STATE);
  }

  public hasSession(): boolean {
    // tslint:disable-next-line: no-string-literal
    return this.request.headers && this.request.headers['cookie'] && this.request.headers['cookie'].indexOf('SESSION') >= 0;
  }

  public get<T>(url: string, options: any = {}, cache = true): Observable<T> {
    const key = JSON.stringify({ url: url.replace(this.appConfig.serviceUrl, ''), options });
    if (this.cache.hasOwnProperty(key)) {
      return of(this.cache[key]);
    }
    // tslint:disable-next-line:no-shadowed-variable
    return this.processRequest<T>(url, options, (url: string, options: any): any => {
      return this.http.get<T>(url, options);
    }).pipe(
      tap((response: T) => {
        if (cache) {
          this.cache[key] = response;
          if (isPlatformServer(this.platformId)) {
            this.transferState.set<any>(REST_CACHE_TRANSLATE_STATE, this.cache);
          }
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
    return callback(url, options).pipe(
      map((response: T) => {
        return response;
      })
    );
  }

  private processRequestWithData<T>(url: string, body: any, options: any, callback: (url: string, body: any, options: any) => Observable<T>) {
    return callback(url, body, options).pipe(
      map((response: T) => {
        return response;
      })
    );
  }

}
