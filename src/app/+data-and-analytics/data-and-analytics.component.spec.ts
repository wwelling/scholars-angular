import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { TranslateModule } from '@ngx-translate/core';

import { testAppConfig } from '../../test.config';
import { getRequest } from '../app.browser.module';
import { APP_CONFIG } from '../app.config';
import { IndividualRepo } from '../core/model/discovery/repo/individual.repo';
import { RestService } from '../core/service/rest.service';
import { metaReducers, reducers } from '../core/store';
import { SharedModule } from '../shared/shared.module';
import { DataAndAnalyticsComponent } from './data-and-analytics.component';
import { routes } from './data-and-analytics.routes';

describe('DataAndAnalyticsComponent', () => {
  let component: DataAndAnalyticsComponent;
  let fixture: ComponentFixture<DataAndAnalyticsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DataAndAnalyticsComponent],
      imports: [
        NoopAnimationsModule,
        SharedModule,
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
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes(routes),
      ],
      providers: [
        { provide: APP_CONFIG, useValue: testAppConfig },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: REQUEST, useFactory: getRequest },
        { provide: APP_CONFIG, useValue: testAppConfig },
        RestService,
        IndividualRepo
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataAndAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
