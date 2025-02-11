import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { queueScheduler, scheduled } from 'rxjs';

import { testAppConfig } from '../../../test.config';
import { APP_CONFIG } from '../../app.config';
import { metaReducers, reducers } from '../../core/store';
import { VisualizationModule } from '../visualization.module';
import { routes } from '../visualization.routes';
import { CoAuthorNetworkComponent } from './co-author-network.component';

describe('CoAuthorNetworkComponent', () => {
  let component: CoAuthorNetworkComponent;
  let fixture: ComponentFixture<CoAuthorNetworkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
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
        VisualizationModule,
      ],
      providers: [
        { provide: APP_CONFIG, useValue: testAppConfig },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              params: scheduled([{ collection: 'individual', id: 'test' }], queueScheduler),
              data: scheduled([{ individual: { id: 'test', name: 'Test' } }], queueScheduler)
            },
          },
        },
        TranslateService
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoAuthorNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
