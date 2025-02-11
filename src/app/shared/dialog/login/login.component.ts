import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, combineLatest, queueScheduler, scheduled } from 'rxjs';
import { map } from 'rxjs/operators';

import { DialogButtonType, DialogControl } from '../../../core/model/dialog';
import { AppState } from '../../../core/store';
import { selectIsLoggingIn } from '../../../core/store/auth';

import * as fromAuth from '../../../core/store/auth/auth.actions';
import * as fromDialog from '../../../core/store/dialog/dialog.actions';

@Component({
  selector: 'scholars-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public dialog: DialogControl;

  constructor(
    private builder: UntypedFormBuilder,
    private translate: TranslateService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.dialog = {
      title: this.translate.get('SHARED.DIALOG.LOGIN.TITLE'),
      form: this.builder.group({
        email: new UntypedFormControl('', [Validators.required, Validators.email]),
        password: new UntypedFormControl('', [Validators.required]),
      }),
      close: {
        type: DialogButtonType.OUTLINE_WARNING,
        label: this.translate.get('SHARED.DIALOG.LOGIN.CANCEL'),
        action: () => {
          this.store.dispatch(new fromAuth.ClearSessionAction())
          this.store.dispatch(new fromDialog.CloseDialogAction())
        },
        disabled: () => this.store.pipe(select(selectIsLoggingIn)),
      },
      submit: {
        type: DialogButtonType.OUTLINE_PRIMARY,
        label: this.translate.get('SHARED.DIALOG.LOGIN.SUBMIT'),
        action: () => this.store.dispatch(new fromAuth.LoginAction({ login: this.dialog.form.value })),
        disabled: () => combineLatest([
          scheduled([this.dialog.form.invalid], queueScheduler),
          scheduled([this.dialog.form.pristine], queueScheduler),
          this.store.pipe(select(selectIsLoggingIn))
        ]).pipe(map((results) => results[0] || results[1] || results[2])),
      },
    };
  }

  public isValid(field: string): boolean {
    const formControl = this.dialog.form.controls[field];
    return formControl.touched && formControl.valid;
  }

  public isInvalid(field: string): boolean {
    const formControl = this.dialog.form.controls[field];
    return formControl.dirty && formControl.invalid;
  }

  public getErrorMessage(field: string): Observable<string> {
    const errors = this.dialog.form.controls[field].errors;
    for (const validation in errors) {
      if (errors.hasOwnProperty(validation)) {
        switch (validation) {
          case 'required':
            return this.translate.get('SHARED.DIALOG.VALIDATION.REQUIRED', {
              field,
            });
          case 'email':
            return this.translate.get('SHARED.DIALOG.VALIDATION.EMAIL', {
              field,
            });
          default:
            return scheduled(['unknown error'], queueScheduler);
        }
      }
    }
  }
}
