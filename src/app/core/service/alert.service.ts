import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AlertLocation, AlertType } from '../model/alert';

import * as fromAlert from '../store/alert/alert.actions';
import * as fromAuth from '../store/auth/auth.actions';
import * as fromSdr from '../store/sdr/sdr.actions';

@Injectable({
  providedIn: 'root',
})
export class AlertService {

  private isPlatformBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: string, private translate: TranslateService) {
    this.isPlatformBrowser = isPlatformBrowser(platformId);
  }

  // NOTE: using translate.instant requires the translation json be loaded before

  public setLanguageSuccessAlert(payload: { language: string }): fromAlert.AlertActions {
    return this.alert(
      AlertLocation.MAIN,
      AlertType.SUCCESS,
      this.translate.instant('LANGUAGE.SET.SUCCESS', {
        language: payload.language,
      }),
      true,
      10000
    );
  }

  public setLanguageFailureAlert(payload: { error: any; language: string }): fromAlert.AlertActions {
    return this.alert(
      AlertLocation.MAIN,
      AlertType.DANGER,
      this.translate.instant('LANGUAGE.SET.FAILURE', {
        language: payload.language,
      }),
      true,
      15000
    );
  }

  public loginSuccessAlert(): fromAlert.AlertActions {
    return this.alert(AlertLocation.MAIN, AlertType.SUCCESS, this.translate.instant('SHARED.ALERT.LOGIN_SUCCESS'), true, 10000);
  }

  public loginFailureAlert(payload: { response: any }): fromAlert.AlertActions {
    return this.alert(AlertLocation.DIALOG, AlertType.DANGER, payload.response.error, true, 15000);
  }

  public submitRegistrationSuccessAlert(): fromAlert.AlertActions {
    return this.alert(AlertLocation.MAIN, AlertType.SUCCESS, this.translate.instant('SHARED.ALERT.SUBMIT_REGISTRATION_SUCCESS'), true, 15000);
  }

  public submitRegistrationFailureAlert(payload: { response: any }): fromAlert.AlertActions {
    return this.alert(AlertLocation.DIALOG, AlertType.DANGER, `(${payload.response.status}) ${payload.response.message}`, true, 15000);
  }

  public confirmRegistrationSuccessAlert(): fromAlert.AlertActions {
    return this.alert(AlertLocation.DIALOG, AlertType.SUCCESS, this.translate.instant('SHARED.ALERT.CONFIRM_REGISTRATION_SUCCESS'), false);
  }

  public confirmRegistrationFailureAlert(payload: { response: any }): fromAlert.AlertActions {
    return this.alert(AlertLocation.MAIN, AlertType.DANGER, `(${payload.response.status}) ${payload.response.error}`, true, 15000);
  }

  public completeRegistrationSuccessAlert(): fromAlert.AlertActions {
    return this.alert(AlertLocation.MAIN, AlertType.SUCCESS, this.translate.instant('SHARED.ALERT.COMPLETE_REGISTRATION_SUCCESS'), true, 15000);
  }

  public completeRegistrationFailureAlert(payload: { response: any }): fromAlert.AlertActions {
    return this.alert(AlertLocation.DIALOG, AlertType.DANGER, `(${payload.response.status}) ${payload.response.message}`, true, 15000);
  }

  public unauthorizedAlert(): fromAlert.AlertActions {
    return this.alert(AlertLocation.DIALOG, AlertType.WARNING, this.translate.instant('SHARED.ALERT.UNAUTHORIZED'), false);
  }

  public forbiddenAlert(): fromAlert.AlertActions {
    return this.alert(AlertLocation.DIALOG, AlertType.WARNING, this.translate.instant('SHARED.ALERT.FORBIDDEN'), false);
  }

  public connectFailureAlert(): fromAlert.AlertActions {
    return this.alert(AlertLocation.MAIN, AlertType.DANGER, this.translate.instant('SHARED.ALERT.CONNECT_FAILED'), true, 15000);
  }

  public disconnectFailureAlert(): fromAlert.AlertActions {
    return this.alert(AlertLocation.MAIN, AlertType.DANGER, this.translate.instant('SHARED.ALERT.DISCONNECT_FAILED'), true, 15000);
  }

  public unsubscribeFailureAlert(): fromAlert.AlertActions {
    return this.alert(AlertLocation.MAIN, AlertType.DANGER, this.translate.instant('SHARED.ALERT.UNSUBSCRIBE_FAILED'), true, 15000);
  }

  public loadActiveThemeFailureAlert(payload: { response: any }): fromAuth.AuthActions | fromAlert.AlertActions {
    return this.handleUnauthorized(AlertLocation.MAIN, AlertType.DANGER, payload.response);
  }

  public applyActiveThemeFailureAlert(payload: { error: string }): fromAlert.AlertActions {
    return this.alert(AlertLocation.MAIN, AlertType.DANGER, payload.error, true, 15000);
  }

  public getAllFailureAlert(payload: { response: any }): fromAuth.AuthActions | fromAlert.AlertActions {
    return this.handleUnauthorized(AlertLocation.MAIN, AlertType.DANGER, payload.response);
  }

  public getOneFailureAlert(payload: { response: any }): fromAuth.AuthActions | fromAlert.AlertActions {
    return this.handleUnauthorized(AlertLocation.MAIN, AlertType.DANGER, payload.response);
  }

  public getNetworkFailureAlert(payload: { response: any }): fromAuth.AuthActions | fromAlert.AlertActions {
    return this.handleUnauthorized(AlertLocation.MAIN, AlertType.DANGER, payload.response);
  }

  public getAcademicAgeFailureAlert(payload: { response: any }): fromAuth.AuthActions | fromAlert.AlertActions {
    return this.handleUnauthorized(AlertLocation.MAIN, AlertType.DANGER, payload.response);
  }

  public getQuantityDistributionFailureAlert(payload: { response: any }): fromAuth.AuthActions | fromAlert.AlertActions {
    return this.handleUnauthorized(AlertLocation.MAIN, AlertType.DANGER, payload.response);
  }

  public getCoInvestigatorNetworkFailureAlert(payload: { response: any }): fromAuth.AuthActions | fromAlert.AlertActions {
    return this.handleUnauthorized(AlertLocation.MAIN, AlertType.DANGER, payload.response);
  }

  public findByIdInFailureAlert(payload: { response: any }): fromAuth.AuthActions | fromAlert.AlertActions {
    return this.handleUnauthorized(AlertLocation.MAIN, AlertType.DANGER, payload.response);
  }

  public findByTypesInFailureAlert(payload: { response: any }): fromAuth.AuthActions | fromAlert.AlertActions {
    return this.handleUnauthorized(AlertLocation.MAIN, AlertType.DANGER, payload.response);
  }

  public fetchLazyRefernceFailureAlert(payload: { response: any }): fromAuth.AuthActions | fromAlert.AlertActions {
    return this.handleUnauthorized(AlertLocation.MAIN, AlertType.DANGER, payload.response);
  }

  public pageFailureAlert(payload: { response: any }): fromAuth.AuthActions | fromAlert.AlertActions {
    return this.handleUnauthorized(AlertLocation.MAIN, AlertType.DANGER, payload.response);
  }

  public countFailureAlert(payload: { response: any }): fromAuth.AuthActions | fromAlert.AlertActions {
    return this.handleUnauthorized(AlertLocation.MAIN, AlertType.DANGER, payload.response);
  }

  public recentlyUpdatedFailureAlert(payload: { response: any }): fromAuth.AuthActions | fromAlert.AlertActions {
    return this.handleUnauthorized(AlertLocation.MAIN, AlertType.DANGER, payload.response);
  }

  public searchFailureAlert(payload: { response: any }): fromAuth.AuthActions | fromAlert.AlertActions {
    return this.handleUnauthorized(AlertLocation.MAIN, AlertType.DANGER, payload.response);
  }

  public postSuccessAlert(action: fromSdr.PostResourceSuccessAction): fromAlert.AlertActions {
    return this.alert(AlertLocation.MAIN, AlertType.SUCCESS, this.translate.instant('SHARED.ALERT.POST_SUCCESS'), true, 10000);
  }

  public postFailureAlert(payload: { response: any }): fromAuth.AuthActions | fromAlert.AlertActions {
    return this.handleUnauthorized(AlertLocation.MAIN, AlertType.DANGER, payload.response);
  }

  public putSuccessAlert(action: fromSdr.PutResourceSuccessAction): fromAlert.AlertActions {
    return this.alert(AlertLocation.MAIN, AlertType.SUCCESS, this.translate.instant('SHARED.ALERT.PUT_SUCCESS'), true, 10000);
  }

  public putFailureAlert(payload: { response: any }): fromAuth.AuthActions | fromAlert.AlertActions {
    return this.handleUnauthorized(AlertLocation.MAIN, AlertType.DANGER, payload.response);
  }

  public patchSuccessAlert(action: fromSdr.PatchResourceSuccessAction): fromAlert.AlertActions {
    return this.alert(AlertLocation.MAIN, AlertType.SUCCESS, this.translate.instant('SHARED.ALERT.PATCH_SUCCESS'), true, 10000);
  }

  public patchFailureAlert(payload: { response: any }): fromAuth.AuthActions | fromAlert.AlertActions {
    return this.handleUnauthorized(AlertLocation.MAIN, AlertType.DANGER, payload.response);
  }

  public deleteSuccessAlert(action: fromSdr.DeleteResourceSuccessAction): fromAlert.AlertActions {
    return this.alert(AlertLocation.MAIN, AlertType.SUCCESS, this.translate.instant('SHARED.ALERT.DELETE_SUCCESS'), true, 10000);
  }

  public deleteFailureAlert(payload: { response: any }): fromAuth.AuthActions | fromAlert.AlertActions {
    return this.handleUnauthorized(AlertLocation.MAIN, AlertType.DANGER, payload.response);
  }

  public handleUnauthorized(location: AlertLocation, type: AlertType, response: any): fromAuth.AuthActions | fromAlert.AlertActions {
    if (response.status === 401) {
      return new fromAuth.LogoutAction({ reauthenticate: true });
    }

    return this.alert(location, type, `(${response.status}) ${response.message}`, true, 15000);
  }

  public alert(location: AlertLocation, type: AlertType, message: string, dismissible: boolean, timer?: number): fromAlert.AlertActions {
    if (this.isPlatformBrowser) {
      return new fromAlert.AddAlertAction({
        alert: { location, type, message, dismissible, timer },
      });
    } else {
      return new fromAlert.NoopAlertAction({
        alert: { location, type, message, dismissible, timer },
      });
    }
  }

}
