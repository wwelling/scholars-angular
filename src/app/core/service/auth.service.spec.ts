import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { REQUEST } from '@nguniversal/express-engine/tokens';

import { AuthService } from './auth.service';
import { RestService } from './rest.service';

import { getRequest } from '../../app.browser.module';

describe('AuthService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                { provide: REQUEST, useFactory: (getRequest) },
                {
                    provide: 'APP_CONFIG', useValue: {
                        host: 'localhost',
                        port: 4200,
                        baseHref: '/',
                        serviceUrl: 'http://localhost:9000',
                        vivoUrl: 'https://scholars.library.tamu.edu/vivo',
                        vivoEditorUrl: 'https://scholars.library.tamu.edu/vivo_editor'
                    }
                },
                RestService,
                AuthService
            ]
        });
    });

    it('should be created', inject([AuthService], (service: AuthService) => {
        expect(service).toBeTruthy();
    }));

});
