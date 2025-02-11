import { Params } from '@angular/router';
import { RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { FILTER_VALUE_DELIMITER } from '../../../shared/utilities/discovery.utility';
import { Filter } from '../../model/view';
import { CustomRouterState } from './router.reducer';

export const selectRouterState = createFeatureSelector<RouterReducerState<CustomRouterState>>('router');

export const selectRouterUrl = createSelector(selectRouterState, (router: RouterReducerState<CustomRouterState>) => router && router.state && router.state.url);
export const selectRouterParams = createSelector(selectRouterState, (router: RouterReducerState<CustomRouterState>) => router && router.state && router.state.params);
export const selectRouterQueryParams = createSelector(selectRouterState, (router: RouterReducerState<CustomRouterState>) => router && router.state && router.state.queryParams);
export const selectRouterData = createSelector(selectRouterState, (router: RouterReducerState<CustomRouterState>) => router && router.state && router.state.data);
export const selectRouterSearchQuery = createSelector(selectRouterState, (router: RouterReducerState<CustomRouterState>) => (router && router.state && router.state.queryParams ? router.state.queryParams.q : ''));

export const selectRouterQueryParamFilters = createSelector(selectRouterQueryParams, (queryParams: Params): Filter[] => {
  const filters: Filter[] = [];
  if (queryParams.filters) {
    queryParams.filters.split(',').forEach((field: string) => {
      const values = queryParams[`${field}.filter`];
      const opKey = queryParams[`${field}.opKey`];
      if (values) {
        values.split(FILTER_VALUE_DELIMITER).forEach((value: string) => {
          filters.push({
            field,
            value,
            opKey,
          });
        });
      }
    });
  }
  return filters;
});
