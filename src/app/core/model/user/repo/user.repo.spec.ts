import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';

import { REQUEST } from '@nguniversal/express-engine/tokens';

import { StoreModule } from '@ngrx/store';

import { RestService } from '../../../service/rest.service';
import { UserRepo } from './user.repo';

import { metaReducers, reducers } from '../../../store';

import { testAppConfig } from '../../../../../test.config';
import { getRequest } from '../../../../app.browser.module';
import { APP_CONFIG } from '../../../../app.config';

describe('UserRepo', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot(reducers(testAppConfig), {
          metaReducers,
          runtimeChecks: {
            strictStateImmutability: false,
            strictActionImmutability: false,
            strictStateSerializability: false,
            strictActionSerializability: false,
          },
        }),
      ],
      providers: [
        { provide: REQUEST, useFactory: getRequest },
        { provide: APP_CONFIG, useValue: testAppConfig },
        RestService,
        UserRepo
      ],
    });
  });

  it('should be created', inject([UserRepo], (service: UserRepo) => {
    expect(service).toBeTruthy();
  }));
});
