import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, filter } from 'rxjs';

import { Individual } from '../../core/model/discovery';
import { AppState } from '../../core/store';
import { selectResourceSelected, selectResourcesDataNetwork } from '../../core/store/sdr';
import { DataNetwork } from '../../core/store/sdr/sdr.reducer';
import { fadeIn } from '../../shared/utilities/animation.utility';

import * as fromSdr from '../../core/store/sdr/sdr.actions';

@Component({
  selector: 'scholars-co-author-network',
  templateUrl: './co-author-network.component.html',
  styleUrls: ['./co-author-network.component.scss'],
  animations: [fadeIn],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoAuthorNetworkComponent implements OnDestroy, OnInit {

  public individual: Observable<Individual>;

  public dataNetwork: Observable<DataNetwork>;

  constructor(private store: Store<AppState>, private route: ActivatedRoute) { }

  ngOnDestroy() {
    this.store.dispatch(new fromSdr.ClearResourcesAction('individual'));
  }

  ngOnInit() {

    this.individual = this.store.pipe(
      select(selectResourceSelected('individual')),
      filter((individual: Individual) => individual !== undefined)
    );
    this.dataNetwork = this.store.pipe(
      select(selectResourcesDataNetwork('individual')),
      filter((individual: DataNetwork) => individual !== undefined),
    );

    setTimeout(() => {
      this.route.parent.data.subscribe(data => {
        this.store.dispatch(new fromSdr.GetNetworkAction('individual', {
          id: data.individual.id,
          dateField: 'publicationDate',
          dataFields: ['authors'],
          typeFilter: 'class:Document'
        }));
      });
    });
  }

  asIsOrder(): number {
    return 0;
  }

}
