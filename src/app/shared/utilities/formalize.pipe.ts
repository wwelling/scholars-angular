import { Pipe, PipeTransform } from '@angular/core';

import { formalize } from 'scholars-embed-utilities';

import { environment } from '../../../environments/environment';

@Pipe({
  name: 'formalize',
  pure: true
})
export class FormalizePipe implements PipeTransform {
  transform(value) {
    return formalize(value, environment.formalize);
  }
}
