import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { StompSubscription } from '@stomp/stompjs';
import { asapScheduler, Observable, scheduled } from 'rxjs';
import { catchError, filter, map, mergeMap, skipWhile, switchMap, withLatestFrom } from 'rxjs/operators';

import { AppState } from '../';
import { AlertService } from '../../service/alert.service';
import { StompService } from '../../service/stomp.service';

import * as fromStomp from './stomp.actions';

@Injectable()
export class StompEffects implements OnInitEffects {

  constructor(
    private actions: Actions,
    private store: Store<AppState>,
    private stomp: StompService,
    private alert: AlertService
  ) {

  }

  connect = createEffect(() => this.actions.pipe(
    ofType(fromStomp.StompActionTypes.CONNECT),
    switchMap(() =>
      this.stomp.connect().pipe(
        map(() => new fromStomp.ConnectSuccessAction()),
        catchError((response) => scheduled([new fromStomp.ConnectFailureAction({ response })], asapScheduler))
      )
    )
  ));

  connectFailure = createEffect(() => this.actions.pipe(
    ofType(fromStomp.StompActionTypes.CONNECT_FAILURE),
    map(() => this.alert.connectFailureAlert())
  ));

  disconnect = createEffect(() => this.actions.pipe(
    ofType(fromStomp.StompActionTypes.DISCONNECT),
    map((action: fromStomp.DisconnectAction) => action.payload),
    switchMap((payload) => this.stomp.disconnect().pipe(
      map(() => new fromStomp.DisconnectSuccessAction({ reconnect: payload.reconnect })),
      catchError((response) => scheduled([new fromStomp.DisconnectFailureAction({ response })], asapScheduler))
    ))
  ));

  disconnectSuccess = createEffect(() => this.actions.pipe(
    ofType(fromStomp.StompActionTypes.DISCONNECT_SUCCESS),
    map((action: fromStomp.DisconnectSuccessAction) => action.payload),
    skipWhile((payload: { reconnect: boolean }) => !payload.reconnect),
    map(() => new fromStomp.ConnectAction())
  ));

  disconnectFailure = createEffect(() => this.actions.pipe(
    ofType(fromStomp.StompActionTypes.DISCONNECT_FAILURE),
    map(() => this.alert.disconnectFailureAlert())
  ));

  subscribe = createEffect(() => this.actions.pipe(
    ofType(fromStomp.StompActionTypes.SUBSCRIBE),
    map((action: fromStomp.SubscribeAction) => action.payload),
    mergeMap((payload: { channel: string; handle: () => Observable<any> }) =>
      this.stomp.subscribe(payload.channel, payload.handle).pipe(
        map((subscription: StompSubscription) =>
          new fromStomp.SubscribeSuccessAction({
            channel: payload.channel,
            subscription,
          })),
        catchError((response) =>
          scheduled([
            new fromStomp.SubscribeFailureAction({
              channel: payload.channel,
              response,
            }),
          ], asapScheduler))
      )
    )
  ));

  unsubscribe = createEffect(() => this.actions.pipe(
    ofType(fromStomp.StompActionTypes.UNSUBSCRIBE),
    map((action: fromStomp.UnsubscribeAction) => action),
    withLatestFrom(this.store),
    filter(([action, store]) => !!store.stomp.subscriptions.get(action.payload.channel)),
    switchMap(([action, store]) =>
      scheduled([store.stomp.subscriptions.get(action.payload.channel).unsubscribe()], asapScheduler).pipe(
        map(() => new fromStomp.UnsubscribeSuccessAction({
          channel: action.payload.channel,
        })),
        catchError((response) => scheduled([new fromStomp.UnsubscribeFailureAction({ response })], asapScheduler))
      )
    )
  ));

  unsubscribeFailure = createEffect(() => this.actions.pipe(
    ofType(fromStomp.StompActionTypes.UNSUBSCRIBE_FAILURE),
    map(() => this.alert.unsubscribeFailureAlert())
  ));

  ngrxOnInitEffects(): Action {
    return new fromStomp.ConnectAction();
  }

}
