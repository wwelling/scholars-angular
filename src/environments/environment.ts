// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { StoreDevtoolsModule } from '@ngrx/store-devtools';

export const extModules = [
  StoreDevtoolsModule.instrument({
    maxAge: 50
  })
];

export const environment = {
  production: false,
  language: 'en',
  hmr: false,
  stompDebug: false,
  formalize: {
    otherUniversity: 'ExternalOrganization',
    GreyLiterature: 'RepositoryDocuments / Preprints',
    Webpage: 'InternetPublication',
    ERO_0000071: 'Software',
    selectedPublicationTag: 'UN SDG',
    tags: 'UN SDG'
  },
  suppressAside: [
    'Publisher',
    'External Organization',
    'otherUniversity'
  ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
