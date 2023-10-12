import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { DiscoveryView } from '../../core/model/view';
import { AppState } from '../../core/store';
import { selectDiscoveryViewByClass } from '../../core/store/sdr';

@Component({
  selector: 'scholars-about',
  templateUrl: 'about.component.html',
  styleUrls: ['about.component.scss'],
})
export class AboutComponent implements OnInit {

  public discoveryView: Observable<DiscoveryView>;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.discoveryView = this.store.pipe(
      select(selectDiscoveryViewByClass('Person')),
      filter((view: DiscoveryView) => view !== undefined)
    );
  }

}
