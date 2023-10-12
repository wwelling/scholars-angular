import { Component, Input, OnInit } from '@angular/core';
import { Params } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { DirectoryView, OpKey } from '../../core/model/view';
import { AppState } from '../../core/store';
import { selectDirectoryViewByClass, selectResourcesCounts } from '../../core/store/sdr';
import { getQueryParams } from '../utilities/view.utility';

import * as fromSdr from '../../core/store/sdr/sdr.actions';

@Component({
  selector: 'scholars-stats-box',
  templateUrl: 'stats-box.component.html',
  styleUrls: ['stats-box.component.scss'],
})
export class StatsBoxComponent implements OnInit {
  @Input() label: string;

  @Input() classifier: string;

  public counts: Observable<{}>;

  public directoryView: Observable<DirectoryView>;

  constructor(private store: Store<AppState>) { }

  public ngOnInit() {
    this.directoryView = this.store.pipe(
      select(selectDirectoryViewByClass(this.classifier)),
      filter((view: DirectoryView) => view !== undefined)
    );
    this.store.dispatch(
      new fromSdr.CountResourcesAction('individual', {
        label: this.label,
        request: {
          filters: [
            {
              field: 'class',
              value: this.classifier,
              opKey: OpKey.EQUALS,
            },
          ],
        },
      })
    );
    this.counts = this.store.pipe(select(selectResourcesCounts('individual')));
  }

  public format(count: number): string | number {
    if (count >= 1.0e9) {
      return (Math.abs(count) / 1.0e9).toFixed(1).replace('.0', '') + 'b';
    } else if (count >= 1.0e6) {
      return (Math.abs(count) / 1.0e6).toFixed(1).replace('.0', '') + 'm';
    } else if (count >= 1.0e3) {
      return (Math.abs(count) / 1.0e3).toFixed(1).replace('.0', '') + 'k';
    } else {
      return count;
    }
  }

  public getDirectoryRouterLink(directoryView: DirectoryView): string[] {
    return [`/directory/${directoryView.name}`];
  }

  public getDirectoryQueryParams(directoryView: DirectoryView): Params {
    const queryParams: Params = getQueryParams(directoryView);
    queryParams.page = 1;
    return queryParams;
  }
}
