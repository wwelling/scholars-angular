import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { APP_CONFIG, AppConfig } from '../app.config';
import { Individual } from '../core/model/discovery';
import { SdrFacet, SdrPage } from '../core/model/sdr';
import { DirectoryView, DiscoveryView, Filter } from '../core/model/view';
import { AppState } from '../core/store';
import { selectRouterQueryParamFilters, selectRouterQueryParams } from '../core/store/router';
import { selectAllResources, selectDiscoveryViewByClass, selectResourceById, selectResourceIsLoading, selectResourcesFacets, selectResourcesPage } from '../core/store/sdr';
import { hasFilter } from '../shared/utilities/discovery.utility';
import { addExportToQueryParams, getFilterField, getFilterValue, hasExport, removeFilterFromQueryParams, resetFiltersInQueryParams, showClearFilters, showFilter } from '../shared/utilities/view.utility';

@Component({
  selector: 'scholars-directory',
  templateUrl: 'directory.component.html',
  styleUrls: ['directory.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectoryComponent implements OnDestroy, OnInit {

  public queryParams: Observable<Params>;

  public filters: Observable<Filter[]>;

  public directoryView: Observable<DirectoryView>;

  public discoveryView: Observable<DiscoveryView>;

  public documents: Observable<Individual[]>;

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
    this.queryParams = this.store.pipe(select(selectRouterQueryParams));
    this.filters = this.store.pipe(select(selectRouterQueryParamFilters));
    this.loading = this.store.pipe(select(selectResourceIsLoading('individual')));
    this.documents = this.store.pipe(select(selectAllResources<Individual>('individual')));
    this.page = this.store.pipe(select(selectResourcesPage<Individual>('individual')));
    this.facets = this.store.pipe(select(selectResourcesFacets<Individual>('individual')));
    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        if (params.view) {
          this.directoryView = this.store.pipe(
            select(selectResourceById('directoryViews', params.view)),
            filter((view: DirectoryView) => view !== undefined),
            tap((view: DirectoryView) => {
              const classFilter: Filter = view.filters.find((f: Filter) => f.field === 'class');
              this.discoveryView = this.store.pipe(
                select(selectDiscoveryViewByClass(classFilter.value)),
                filter((discoveryView: DiscoveryView) => discoveryView !== undefined)
              );
            })
          );
        }
      })
    );
  }

  public isActive(directoryView: DirectoryView, params: Params, option: string): boolean {
    const queryParams: Params = { ...params };
    if (hasFilter(queryParams.filters, directoryView.index.field)) {
      return queryParams[`${directoryView.index.field}.filter`] === option;
    }
    return option === 'All';
  }

  public showFilter(directoryView: DirectoryView, actualFilter: Filter): boolean {
    return showFilter(directoryView, actualFilter);
  }

  public showClearFilters(directoryView: DirectoryView, filters: Filter[]): boolean {
    return showClearFilters(directoryView, filters);
  }

  public getFilterField(directoryView: DirectoryView, actualFilter: Filter): string {
    return getFilterField(directoryView, actualFilter);
  }

  public getFilterValue(directoryView: DirectoryView, actualFilter: Filter): string {
    return getFilterValue(directoryView, actualFilter);
  }

  public hasExport(directoryView: DirectoryView): boolean {
    return hasExport(directoryView);
  }

  public getDirectoryRouterLink(directoryView: DirectoryView): string[] {
    return ['/directory', directoryView.name];
  }

  public getDirectoryExportUrl(params: Params, directoryView: DirectoryView): string {
    const queryParams: Params = { ...params };
    queryParams.facets = null;
    queryParams.collection = null;
    addExportToQueryParams(queryParams, directoryView);
    const tree = this.router.createUrlTree([''], { queryParams });
    const query = tree.toString().substring(1);
    return `${this.appConfig.serviceUrl}/individual/search/export${query}&view=${directoryView.name}`;
  }

  public getDirectoryQueryParamsRemovingFilter(params: Params, filterToRemove: Filter): Params {
    const queryParams: Params = { ...params };
    removeFilterFromQueryParams(queryParams, filterToRemove);
    return queryParams;
  }

  public getDirectoryQueryParamsResetting(params: Params, directoryView: DirectoryView): Params {
    const queryParams: Params = { ...params };
    if (hasFilter(queryParams.filters, directoryView.index.field)) {
      const filters = queryParams.filters.split(',')
        .map((field) => field.trim())
        .filter((field) => field !== directoryView.index.field);
      if (filters.length > 0) {
        queryParams.filters = filters.join(',');
      } else {
        delete queryParams.filters;
      }
      delete queryParams[`${directoryView.index.field}.filter`];
      delete queryParams[`${directoryView.index.field}.opKey`];
    }
    return queryParams;
  }

  public getDirectoryQueryParamsClearingFilters(params: Params, discoveryView: DiscoveryView): Params {
    const queryParams: Params = { ...params };
    resetFiltersInQueryParams(queryParams, discoveryView);
    return queryParams;
  }

  public getDirectoryQueryParamsWithOption(params: Params, directoryView: DirectoryView, option: string): Params {
    const queryParams: Params = { ...params };
    queryParams.page = 1;
    if (option) {
      queryParams[`${directoryView.index.field}.filter`] = option;
      queryParams[`${directoryView.index.field}.opKey`] = directoryView.index.opKey;
      if (!queryParams.filters) {
        queryParams.filters = directoryView.index.field;
      } else {
        if (queryParams.filters.split(',').indexOf(directoryView.index.field) < 0) {
          queryParams.filters += `,${directoryView.index.field}`;
        }
      }
    }
    return queryParams;
  }

  public trackByOption(index: number, option: string): string {
    return option;
  }

}
