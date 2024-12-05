import { createFeatureSelector, createSelector } from '@ngrx/store';

import { SdrResource } from '../../model/sdr';
import { CollectionView, DirectoryView, DiscoveryView, DisplayView, Filter } from '../../model/view';

import * as fromSdr from './sdr.reducer';

export const selectSdrState = <R extends SdrResource>(name: string) => createFeatureSelector<fromSdr.SdrState<R>>(name);

export const selectResourceIds = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.selectIds(name));
export const selectResourceEntities = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.selectEntities(name));
export const selectAllResources = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.selectAll(name));
export const selectResourcesTotal = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.selectTotal(name));

export const selectResourceError = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.getError);
export const selectResourceIsSelecting = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.isSelecting);
export const selectResourceIsCounting = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.isCounting);
export const selectResourceIsLoading = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.isLoading);
export const selectResourceIsDereferencing = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.isDereferencing);
export const selectResourceIsUpdating = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.isUpdating);

export const selectResourcesCounts = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.getCounts);
export const selectResourcesCountByLabel = <R extends SdrResource>(name: string, label: string) => createSelector(selectSdrState<R>(name), fromSdr.getCountByLabel(label));
export const selectResourceSelected = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.getSelected);
export const selectResourcesPage = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.getPage);
export const selectResourcesFacets = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.getFacets);
export const selectResourcesLinks = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.getLinks);
export const selectResourcesRecentlyUpdated = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.getRecentlyUpdated);
export const selectResourcesDataNetwork = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.getDataNetwork);
export const selectResourcesAcademicAge = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.getAcademicAge);
export const selectResourcesQuantityDistribution = <R extends SdrResource>(name: string) => createSelector(selectSdrState<R>(name), fromSdr.getQuantityDistribution);

export const selectResourceById = <R extends SdrResource>(name: string, id: string | number) => createSelector(selectResourceEntities<R>(name), (resources) => resources[id]);

export const selectCollectionViewByName = (collectionViewType: string, name: string) => createSelector(selectResourceEntities<CollectionView>(collectionViewType), (collectionViews) => collectionViews[name]);

const findCollectionView = (collectionViews, clazz: string, type: string[]): CollectionView => {
  let view;
  let defaultView;

  let maxMatchCount = 0;
  for (const collectionView of collectionViews) {
    const viewByClass = collectionView.filters.find((filter: Filter) => filter.field === 'class');
    if (viewByClass) {
      const checkType = type.length > 0 && viewByClass.value.indexOf('type:');
      const hasMatchingType = checkType && viewByClass.value.indexOf(`type:${type[0]}`) >= 0;
      const hasMatchingStartingClass = viewByClass.value.startsWith(clazz);

      let matchCount = 0;

      if (hasMatchingType) {
        matchCount++;
      }

      if (hasMatchingStartingClass) {
        matchCount++;
      }

      if (matchCount > maxMatchCount) {
        view = collectionView;
        maxMatchCount = matchCount;
      }
    }

    if (collectionView.name === 'People') {
      defaultView = collectionView;
    }
  }

  if (maxMatchCount === 0) {
    view = defaultView;
  }

  return view;
};

export const selectDirectoryViewByClass = (clazz: string, type: string[] = []) => createSelector(selectAllResources<DirectoryView>('directoryViews'), (resources) => findCollectionView(resources, clazz, type));

export const selectDiscoveryViewByClass = (clazz: string, type: string[] = []) => createSelector(selectAllResources<DiscoveryView>('discoveryViews'), (resources) => findCollectionView(resources, clazz, type));

const findDisplayView = (displayViews, types: string[], defaultName: string): DisplayView => {
  let view;
  for (const key in displayViews) {
    if (displayViews.hasOwnProperty(key)) {
      for (const i in types) {
        if (displayViews.hasOwnProperty(key)) {
          if (displayViews[key].types.indexOf(types[i]) >= 0) {
            view = displayViews[key];
            break;
          }
        }
      }
      if (displayViews[key].name === defaultName) {
        view = displayViews[key];
      }
    }
  }
  return view;
};

export const selectDisplayViewByTypes = (types: string[]) => createSelector(selectResourceEntities<DisplayView>('displayViews'), (resources) => findDisplayView(resources, types, 'Default'));
