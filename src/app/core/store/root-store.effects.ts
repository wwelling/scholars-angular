import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, TransferState } from '@angular/core';
import { OnInitEffects } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { AppState } from '.';
import { STORE_TRANSLATE_STATE } from '../../app.module';

import * as fromStore from './root-store.actions';

@Injectable()
export class RootStoreEffects implements OnInitEffects {

  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private store: Store<AppState>,
    private transferState: TransferState,
  ) { }

  ngrxOnInitEffects(): Action {
    if (isPlatformBrowser(this.platformId)) {
      const serializedState = this.transferState.get<string>(STORE_TRANSLATE_STATE, undefined);

      if (!!serializedState) {
        const state = JSON.parse(serializedState);
        this.store.dispatch(new fromStore.RehydrateAction({ state }));
        this.transferState.remove(STORE_TRANSLATE_STATE);
      }
    }
    return { type: '' };
  }

}
