import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';

import { REQUEST } from '@nguniversal/express-engine/tokens';

import { StoreModule } from '@ngrx/store';

import { RestService } from '../../../service/rest.service';
import { DataAndAnalyticsViewRepo } from './data-and-analytics-view.repo';

import { metaReducers, reducers } from '../../../store';

import { testAppConfig } from '../../../../../test.config';
import { getRequest } from '../../../../app.browser.module';
import { APP_CONFIG } from '../../../../app.config';

describe('DataAndAnalyticsViewRepo', () => {
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
        DataAndAnalyticsViewRepo
      ],
    });
  });

  it('should be created', inject([DataAndAnalyticsViewRepo], (service: DataAndAnalyticsViewRepo) => {
    expect(service).toBeTruthy();
  }));
});
