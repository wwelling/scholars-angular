import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Store, select, Action } from '@ngrx/store';

import { Observable } from 'rxjs';

import { AppState } from '../../core/store';
import { SidebarMenu, SidebarSection } from '../../core/model/sidebar';

import { selectIsSidebarCollapsed } from '../../core/store/layout';
import { selectMenu } from '../../core/store/sidebar';

import { fadeIn } from '../utilities/animation.utility';

import * as fromSidebar from '../../core/store/sidebar/sidebar.actions';
import { Params, Router } from '@angular/router';
import { selectRouterUrl } from 'src/app/core/store/router';
import { selectResourceIsLoading } from 'src/app/core/store/sdr';

@Component({
  selector: 'scholars-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.scss'],
  animations: [fadeIn],
})
export class SidebarComponent implements OnInit {

  public isSidebarCollapsed: Observable<boolean>;

  public menu: Observable<SidebarMenu>;

  public url: Observable<string>;

  public loading: Observable<boolean>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private store: Store<AppState>,
    private router: Router
  ) { }

  ngOnInit() {
    this.isSidebarCollapsed = this.store.pipe(select(selectIsSidebarCollapsed));
    this.menu = this.store.pipe(select(selectMenu));
    this.url = this.store.pipe(select(selectRouterUrl));
    this.loading = this.store.pipe(select(selectResourceIsLoading('individual')));
  }

  public toggleSectionCollapse(sectionIndex: number): void {
    this.store.dispatch(new fromSidebar.ToggleCollapsibleSectionAction({ sectionIndex }));
  }

  public dispatchAction(event: any, action: Action): void {
    if (event instanceof MouseEvent || event instanceof KeyboardEvent && (event.key === 'Enter' || event.key === 'Space')) {
      this.store.dispatch(action);
    }
  }

  public isBrowserRendered(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  public isServerRendered(): boolean {
    return isPlatformServer(this.platformId);
  }

  public getRouterLink(): string[] {
    return [];
  }

  public getQueryParams(section: SidebarSection, url: string): Params {
    const tree = this.router.parseUrl(url);
    const expanded = tree.queryParams.expanded ? tree.queryParams.expanded.split(',') : [];
    const encodedTitle = encodeURIComponent(section.title);
    const index = expanded.indexOf(encodedTitle);
    const isCollapsed = section.collapsed;
    if (isCollapsed) {
      if (index < 0) {
        expanded.push(encodedTitle);
      }
    } else {
      if (index >= 0) {
        expanded.splice(index, 1);
      }
    }
    if (expanded.length > 0) {
      tree.queryParams.expanded = expanded.join(',');
    } else {
      delete tree.queryParams.expanded;
    }
    return tree.queryParams;
  }

}
