import { Action } from '@ngrx/store';

import { Alert } from '../../model/alert';

export enum AlertActionTypes {
  ADD_ALERT = '[Alert] add alert',
  DISMISS_ALERT = '[Alert] dismiss alert',
  NOOP_ALERT = '[Alert] noop alert'
}

export class AddAlertAction implements Action {
  readonly type = AlertActionTypes.ADD_ALERT;
  constructor(public payload: { alert: Alert }) { }
}

export class DismissAlertAction implements Action {
  readonly type = AlertActionTypes.DISMISS_ALERT;
  constructor(public payload: { alert: Alert }) { }
}

export class NoopAlertAction implements Action {
  readonly type = AlertActionTypes.NOOP_ALERT;
  constructor(public payload: { alert: Alert }) { }
}

export type AlertActions =
  AddAlertAction |
  DismissAlertAction |
  NoopAlertAction;
