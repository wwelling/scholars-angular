import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { REQUEST } from '@nguniversal/express-engine/tokens';

import { testAppConfig } from '../../../test.config';
import { getRequest } from '../../app.browser.module';
import { APP_CONFIG } from '../../app.config';
import { RestService } from './rest.service';

describe('RestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: REQUEST, useFactory: getRequest },
        { provide: APP_CONFIG, useValue: testAppConfig },
        RestService
      ],
    });
  });

  it('should be created', inject([RestService], (service: RestService) => {
    expect(service).toBeTruthy();
  }));
});
