import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, combineLatest, queueScheduler, scheduled } from 'rxjs';
import { map } from 'rxjs/operators';

import { DialogButtonType, DialogControl } from '../../../core/model/dialog';
import { Role, User } from '../../../core/model/user';
import { AppState } from '../../../core/store';
import { selectResourceIsUpdating } from '../../../core/store/sdr';

import * as fromDialog from '../../../core/store/dialog/dialog.actions';
import * as fromSdr from '../../../core/store/sdr/sdr.actions';

@Component({
  selector: 'scholars-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent implements OnInit {
  @Input() user: User;

  public roles: string[];

  public dialog: DialogControl;

  constructor(private builder: UntypedFormBuilder, private translate: TranslateService, private store: Store<AppState>) { }

  ngOnInit() {
    this.roles = Object.keys(Role);
    this.dialog = {
      title: this.translate.get('SHARED.DIALOG.USER_EDIT.TITLE'),
      form: this.builder.group({
        firstName: new UntypedFormControl({ value: this.user.firstName, disabled: true }, [Validators.required]),
        lastName: new UntypedFormControl({ value: this.user.lastName, disabled: true }, [Validators.required]),
        email: new UntypedFormControl({ value: this.user.email, disabled: true }, [Validators.required, Validators.email]),
        role: new UntypedFormControl(this.user.role, [Validators.required]),
        active: new UntypedFormControl({ value: this.user.active, disabled: true }, [Validators.required]),
        enabled: new UntypedFormControl(this.user.enabled, [Validators.required]),
      }),
      close: {
        type: DialogButtonType.OUTLINE_WARNING,
        label: this.translate.get('SHARED.DIALOG.USER_EDIT.CANCEL'),
        action: () => this.store.dispatch(new fromDialog.CloseDialogAction()),
        disabled: () => this.store.pipe(select(selectResourceIsUpdating<User>('users'))),
      },
      submit: {
        type: DialogButtonType.OUTLINE_PRIMARY,
        label: this.translate.get('SHARED.DIALOG.USER_EDIT.SUBMIT'),
        action: () =>
          this.store.dispatch(
            new fromSdr.PatchResourceAction('users', {
              // TODO: come up with strategy to strip off disabled properies during patch, requires HATEOS self links
              resource: Object.assign(this.user, this.dialog.form.value),
            })
          ),
        disabled: () => combineLatest([
          scheduled([this.dialog.form.invalid], queueScheduler),
          scheduled([this.dialog.form.pristine], queueScheduler),
          this.store.pipe(select(selectResourceIsUpdating<User>('users')))
        ]).pipe(map((results) => results[0] || results[1] || results[2])),
      },
    };
  }

  public getRoleValue(role: string): string {
    return Role[role];
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
