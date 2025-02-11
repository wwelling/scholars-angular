import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';

import { extModules } from '../../../environments/environment';
import { metaReducers, reducerProvider, reducerToken } from './';
import { AlertEffects } from './alert/alert.effects';
import { AuthEffects } from './auth/auth.effects';
import { DialogEffects } from './dialog/dialog.effects';
import { LanguageEffects } from './language/language.effects';
import { LayoutEffects } from './layout/layout.effects';
import { MetadataEffects } from './metadata/metadata.effects';
import { RootStoreEffects } from './root-store.effects';
import { RouterEffects } from './router/router.effects';
import { CustomRouterStateSerializer } from './router/router.reducer';
import { SdrEffects } from './sdr/sdr.effects';
import { SidebarEffects } from './sidebar/sidebar.effects';
import { ThemeEffects } from './theme/theme.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot(reducerToken, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false,
        strictStateSerializability: false,
        strictActionSerializability: false,
      },
    }),
    StoreRouterConnectingModule.forRoot({
      serializer: CustomRouterStateSerializer,
    }),
    EffectsModule.forRoot([
      RootStoreEffects,
      RouterEffects,
      ThemeEffects,
      SdrEffects,
      SidebarEffects,
      MetadataEffects,
      LayoutEffects,
      LanguageEffects,
      DialogEffects,
      AuthEffects,
      AlertEffects
    ]),
    extModules,
  ],
  providers: [reducerProvider],
})
export class RootStoreModule { }
