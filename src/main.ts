import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppBrowserModule } from './app/app.browser.module';
import { APP_CONFIG } from './app/app.config';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

document.addEventListener('DOMContentLoaded', () => {
  // fetch runtime configuration, move to provider if and when Angular supports asynchronous providers
  fetch('assets/appConfig.json')
    .then((response) => response.json())
    .then((appConfig) => {
      platformBrowserDynamic([{
        provide: APP_CONFIG,
        useValue: appConfig
      }]).bootstrapModule(AppBrowserModule)
        .catch(console.error);
    });
});
