import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Store, select } from '@ngrx/store';

import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AppState } from '../core/store';
import { AppConfig, APP_CONFIG } from '../app.config';
import { DiscoveryView, Filter } from '../core/model/view';
import { SolrDocument } from '../core/model/discovery';
import { SdrPage, SdrFacet } from '../core/model/sdr';
import { WindowDimensions } from '../core/store/layout/layout.reducer';

import { selectRouterSearchQuery, selectRouterUrl, selectRouterQueryParamFilters, selectRouterQueryParams } from '../core/store/router';
import { selectAllResources, selectResourcesPage, selectResourcesFacets, selectResourceById, selectResourceIsLoading } from '../core/store/sdr';
import { selectWindowDimensions } from '../core/store/layout';

import { addExportToQueryParams, showFilter, showClearFilters, getFilterField, getFilterValue, hasExport, removeFilterFromQueryParams, resetFiltersInQueryParams, getQueryParams } from '../shared/utilities/view.utility';

@Component({
  selector: 'scholars-discovery',
  templateUrl: 'discovery.component.html',
  styleUrls: ['discovery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscoveryComponent implements OnDestroy, OnInit {

  public windowDimensions: Observable<WindowDimensions>;

  public url: Observable<string>;

  public query: Observable<string>;

  public queryParams: Observable<Params>;

  public filters: Observable<any[]>;

  public discoveryViews: Observable<DiscoveryView[]>;

  public discoveryView: Observable<DiscoveryView>;

  public documents: Observable<SolrDocument[]>;

  public loading: Observable<boolean>;

  public page: Observable<SdrPage>;

  public facets: Observable<SdrFacet[]>;

  private subscriptions: Subscription[];

  constructor(
    @Inject(APP_CONFIG) private appConfig: AppConfig,
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.subscriptions = [];
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  ngOnInit() {
    this.windowDimensions = this.store.pipe(select(selectWindowDimensions));
    this.url = this.store.pipe(select(selectRouterUrl));
    this.query = this.store.pipe(select(selectRouterSearchQuery));
    this.queryParams = this.store.pipe(select(selectRouterQueryParams));
    this.filters = this.store.pipe(select(selectRouterQueryParamFilters));
    this.loading = this.store.pipe(select(selectResourceIsLoading('individual')));
    this.documents = this.store.pipe(select(selectAllResources<SolrDocument>('individual')));
    this.page = this.store.pipe(select(selectResourcesPage<SolrDocument>('individual')));
    this.facets = this.store.pipe(select(selectResourcesFacets<SolrDocument>('individual')));
    this.discoveryViews = this.store.pipe(select(selectAllResources<DiscoveryView>('discoveryViews')));
    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        if (params.view) {
          this.discoveryView = this.store.pipe(
            select(selectResourceById('discoveryViews', params.view)),
            filter((view: DiscoveryView) => view !== undefined)
          );
        }
      })
    );
  }

  public showTabs(windowDimensions: WindowDimensions): boolean {
    return windowDimensions.width > 767;
  }

  public isActive(discoveryView: DiscoveryView, url: string): boolean {
    return url.startsWith(`/discovery/${encodeURI(discoveryView.name)}`);
  }

  public showFilter(discoveryView: DiscoveryView, actualFilter: Filter): boolean {
    return showFilter(discoveryView, actualFilter);
  }

  public showClearFilters(discoveryView: DiscoveryView, filters: Filter[]): boolean {
    return showClearFilters(discoveryView, filters);
  }

  public getFilterField(discoveryView: DiscoveryView, actualFilter: Filter): string {
    return getFilterField(discoveryView, actualFilter);
  }

  public getFilterValue(discoveryView: DiscoveryView, actualFilter: Filter): string {
    return getFilterValue(discoveryView, actualFilter);
  }

  public hasExport(discoveryView: DiscoveryView): boolean {
    return hasExport(discoveryView);
  }

  public getDiscoveryRouterLink(discoveryView: DiscoveryView): string[] {
    return ['/discovery', discoveryView.name];
  }

  public getDiscoveryExportUrl(params: Params, discoveryView: DiscoveryView): string {
    const queryParams: Params = Object.assign({}, params);
    queryParams.facets = null;
    queryParams.collection = null;
    addExportToQueryParams(queryParams, discoveryView);
    const tree = this.router.createUrlTree([''], { queryParams });
    const query = tree.toString().substring(1);
    return `${this.appConfig.serviceUrl}/individual/search/export${query}&view=${discoveryView.name}`;
  }

  public getDiscoveryQueryParamsRemovingFilter(params: Params, filterToRemove: Filter): Params {
    const queryParams: Params = Object.assign({}, params);
    removeFilterFromQueryParams(queryParams, filterToRemove);
    return queryParams;
  }

  public getDiscoveryQueryParamsClearingFilters(params: Params, discoveryView: DiscoveryView): Params {
    const queryParams: Params = Object.assign({}, params);
    resetFiltersInQueryParams(queryParams, discoveryView);
    return queryParams;
  }

  public getDiscoveryQueryParamsSwitchingDiscoveryView(params: Params, discoveryView: DiscoveryView): Params {
    const queryParams: Params = getQueryParams(discoveryView);
    queryParams.q = params.q;
    return queryParams;
  }

}
