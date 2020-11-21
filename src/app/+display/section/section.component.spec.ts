import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';

import { scheduled } from 'rxjs';
import { queueScheduler } from 'rxjs';

import { DisplayModule } from '../display.module';

import { SectionComponent } from './section.component';

import { metaReducers, reducers } from '../../core/store';

import { routes } from '../display.routes';

import { testAppConfig } from '../../../test.config';
import { APP_CONFIG } from 'src/app/app.config';

describe('SectionComponent', () => {
  let component: SectionComponent;
  let fixture: ComponentFixture<SectionComponent>;

  const params = {};

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        DisplayModule,
        StoreModule.forRoot(reducers(testAppConfig), {
          metaReducers,
          runtimeChecks: {
            strictStateImmutability: false,
            strictActionImmutability: false,
            strictStateSerializability: false,
            strictActionSerializability: false,
          },
        }),
        RouterTestingModule.withRoutes(routes[0].children),
      ],
      providers: [
        { provide: APP_CONFIG, useValue: testAppConfig },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: scheduled([params], queueScheduler),
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionComponent);
    component = fixture.componentInstance;
    component.section = {
      name: 'Test',
      field: 'publications',
      order: 1,
      filters: [],
      sort: [],
      pageSize: 5,
      template: '',
      templateFunction: (resource: any) => '',
      requiredFields: [],
      lazyReferences: [],
      subsections: [],
      hidden: false,
      shared: false,
      paginated: false,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
