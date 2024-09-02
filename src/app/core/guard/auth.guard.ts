import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store, select } from '@ngrx/store';

import { Observable, asapScheduler, scheduled } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { AlertService } from '../service/alert.service';
import { DialogService } from '../service/dialog.service';

import { Role, User } from '../model/user';
import { AppState } from '../store';

import { selectIsAuthenticated, selectUser } from '../store/auth';

import * as fromAuth from '../store/auth/auth.actions';
import * as fromRouter from '../store/router/router.actions';

@Injectable()
export class AuthGuard {

  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private alert: AlertService,
    private dialog: DialogService,
    private store: Store<AppState>
  ) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const roles = route.data.roles;
    return this.requiresAuthorization(roles).pipe(
      switchMap((authorize: boolean) => {
        return authorize ? this.isAuthorized(state.url, roles) : this.isAuthenticated(state.url);
      })
    );
  }

  private requiresAuthorization(roles: Role[]): Observable<boolean> {
    return roles ? scheduled([true], asapScheduler) : scheduled([false], asapScheduler);
  }

  private isAuthorized(url: string, roles: Role[]): Observable<boolean> {
    return this.isAuthenticated(url).pipe(switchMap((authenticated: boolean) => authenticated ?
      this.store.pipe(
        select(selectUser),
        filter((user: User) => user !== undefined),
        map((user: User) => {
          const authorized = user ? roles.indexOf(Role[user.role]) >= 0 : false;
          if (!authorized) {
            this.store.dispatch(new fromRouter.Link({ url: '/' }));
          }
          return authorized;
        })) : scheduled([false], asapScheduler)));
  }

  private isAuthenticated(url: string): Observable<boolean> {
    return this.store.pipe(
      select(selectIsAuthenticated),
      map((authenticated: boolean) => {
        if (!authenticated) {
          this.store.dispatch(new fromRouter.Link({ url: '/' }));
          if (isPlatformBrowser(this.platformId)) {
            this.store.dispatch(new fromAuth.SetLoginRedirectAction({ url }));
            this.store.dispatch(this.dialog.loginDialog());
            this.store.dispatch(this.alert.forbiddenAlert());
          }
        }
        return authenticated;
      })
    );
  }

}
