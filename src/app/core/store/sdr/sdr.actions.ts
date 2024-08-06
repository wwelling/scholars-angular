import { Action } from '@ngrx/store';

import { Filterable, SdrRequest } from '../../model/request';
import { Queryable } from '../../model/request/sdr.request';
import { Count, SdrCollection } from '../../model/sdr';

export enum SdrActionTypes {
  SELECT_RESOURCE = 'select a resource',
  SELECT_RESOURCE_SUCCESS = 'successfully selected a resource',
  SELECT_RESOURCE_FAILURE = 'failed selected a resource',
  GET_ALL = 'get all resources',
  GET_ALL_SUCCESS = 'sucessfully got all resources',
  GET_ALL_FAILURE = 'failed getting all resources',
  PAGE = 'page resources',
  PAGE_SUCCESS = 'sucessfully paged resources',
  PAGE_FAILURE = 'failed paging resources',
  SEARCH = 'search resources',
  SEARCH_SUCCESS = 'sucessfully searched resources',
  SEARCH_FAILURE = 'failed searching resources',
  COUNT = 'count resources',
  COUNT_SUCCESS = 'sucessfully counted resources',
  COUNT_FAILURE = 'failed counting resources',
  RECENTLY_UPDATED = 'get recently updated',
  RECENTLY_UPDATED_SUCCESS = 'sucessfully got recently updated',
  RECENTLY_UPDATED_FAILURE = 'failed getting recently updated',
  GET_ONE = 'get one resource by id',
  GET_ONE_SUCCESS = 'sucessfully got resource by id',
  GET_ONE_FAILURE = 'failed getting resource by id',
  GET_NETWORK = 'get network for resource by id',
  GET_NETWORK_SUCCESS = 'sucessfully got network for resource by id',
  GET_NETWORK_FAILURE = 'failed getting network for resource by id',
  GET_ACADEMIC_AGE = 'get academic age analytics for resource',
  GET_ACADEMIC_AGE_SUCCESS = 'sucessfully got academic age analytics for resource',
  GET_ACADEMIC_AGE_FAILURE = 'failed getting academic age analytics for resource',
  GET_QUANTITY_DISTRIBUTION = 'get quantity distribution analytics for resource',
  GET_QUANTITY_DISTRIBUTION_SUCCESS = 'sucessfully got quantity distribution analytics for resource',
  GET_QUANTITY_DISTRIBUTION_FAILURE = 'failed getting quantity distribution analytics for resource',
  FIND_BY_ID_IN = 'find resource by id in',
  FIND_BY_ID_IN_SUCCESS = 'sucessfully found resource by id in',
  FIND_BY_ID_IN_FAILURE = 'failed finding resource by id in',
  FIND_BY_TYPES_IN = 'find resource by types in',
  FIND_BY_TYPES_IN_SUCCESS = 'sucessfully found resource by types in',
  FIND_BY_TYPES_IN_FAILURE = 'failed finding resource by types in',
  FETCH_LAZY_REFERENCE = 'fetch lazy reference',
  FETCH_LAZY_REFERENCE_SUCCESS = 'sucessfully fetched lazy reference',
  FETCH_LAZY_REFERENCE_FAILURE = 'failed fetching lazy reference',
  POST = 'post resource',
  POST_SUCCESS = 'sucessfully posted resource',
  POST_FAILURE = 'failed posting resource',
  PUT = 'put resource',
  PUT_SUCCESS = 'sucessfully put resource',
  PUT_FAILURE = 'failed putting resource',
  PATCH = 'patch resource',
  PATCH_SUCCESS = 'sucessfully patched resource',
  PATCH_FAILURE = 'failed patching resource',
  DELETE = 'delete resource',
  DELETE_SUCCESS = 'sucessfully deleteed resource',
  DELETE_FAILURE = 'failed deleting resource',
  CLEAR = 'clear resources',
  CLEAR_ACADEMIC_AGE = 'clear academic age',
  CLEAR_RESOURCE_BY_ID = 'clear resource by id',
}

export const getSdrAction = (actionType: SdrActionTypes, name: string): string => {
  return `[${name}] ${actionType}`;
};

export class SelectResourceAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.SELECT_RESOURCE, this.name);
  constructor(public name: string, public payload: {
    id: number | string,
    queue?: Array<GetOneResourceAction>,
  }) { }
}

export class SelectResourceSuccessAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.SELECT_RESOURCE_SUCCESS, this.name);
  constructor(public name: string, public payload: any) { }
}

export class SelectResourceFailureAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.SELECT_RESOURCE_FAILURE, this.name);
  constructor(public name: string, public payload: any) { }
}

export class GetAllResourcesAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.GET_ALL, this.name);
  constructor(public name: string, public payload?: any) { }
}

export class GetAllResourcesSuccessAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.GET_ALL_SUCCESS, this.name);
  constructor(public name: string, public payload: any) { }
}

export class GetAllResourcesFailureAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.GET_ALL_FAILURE, this.name);
  constructor(public name: string, public payload: any) { }
}

export class PageResourcesAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.PAGE, this.name);
  constructor(public name: string, public payload: { request: SdrRequest }) { }
}

export class PageResourcesSuccessAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.PAGE_SUCCESS, this.name);
  constructor(public name: string, public payload: any) { }
}

export class PageResourcesFailureAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.PAGE_FAILURE, this.name);
  constructor(public name: string, public payload: any) { }
}

export class SearchResourcesAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.SEARCH, this.name);
  constructor(public name: string, public payload: { request: SdrRequest }) { }
}

export class SearchResourcesSuccessAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.SEARCH_SUCCESS, this.name);
  constructor(public name: string, public payload: any) { }
}

export class SearchResourcesFailureAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.SEARCH_FAILURE, this.name);
  constructor(public name: string, public payload: any) { }
}

export class CountResourcesAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.COUNT, this.name);
  constructor(public name: string, public payload: { label: string; request: SdrRequest }) { }
}

export class CountResourcesSuccessAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.COUNT_SUCCESS, this.name);
  constructor(public name: string, public payload: { label: string; count: Count }) { }
}

export class CountResourcesFailureAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.COUNT_FAILURE, this.name);
  constructor(public name: string, public payload: { label: string; response: any }) { }
}

export class RecentlyUpdatedResourcesAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.RECENTLY_UPDATED, this.name);
  constructor(public name: string, public payload: { limit: number; filters: Filterable[] }) { }
}

export class RecentlyUpdatedResourcesSuccessAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.RECENTLY_UPDATED_SUCCESS, this.name);
  constructor(public name: string, public payload: any) { }
}

export class RecentlyUpdatedResourcesFailureAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.RECENTLY_UPDATED_FAILURE, this.name);
  constructor(public name: string, public payload: any) { }
}

export class GetOneResourceAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.GET_ONE, this.name);
  constructor(public name: string, public payload: {
    id: number | string,
    select?: boolean,
    queue?: Array<GetOneResourceAction>,
  }) { }
}

export class GetOneResourceSuccessAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.GET_ONE_SUCCESS, this.name);
  constructor(public name: string, public payload: any) { }
}

export class GetOneResourceFailureAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.GET_ONE_FAILURE, this.name);
  constructor(public name: string, public payload: any) { }
}

export class GetNetworkAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.GET_NETWORK, this.name);
  constructor(public name: string, public payload: {
    id: string | number,
    dateField: string,
    dataFields: string[],
    typeFilter: string,
  }) { }
}

export class GetNetworkSuccessAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.GET_NETWORK_SUCCESS, this.name);
  constructor(public name: string, public payload: any, public actions: Array<Action> = []) { }
}

export class GetNetworkFailureAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.GET_NETWORK_FAILURE, this.name);
  constructor(public name: string, public payload: any) { }
}

export class GetAcademicAgeAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.GET_ACADEMIC_AGE, this.name);
  constructor(public name: string, public payload: {
    label: string;
    query?: Queryable;
    filters?: Filterable[];
    dateField: string,
    accumulateMultivaluedDate?: boolean,
    averageOverInterval?: boolean,
    upperLimitInYears: number,
    groupingIntervalInYears: number,
    queue: Array<Action>,
  }) { }
}

export class GetAcademicAgeSuccessAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.GET_ACADEMIC_AGE_SUCCESS, this.name);
  constructor(public name: string, public payload: any) { }
}

export class GetAcademicAgeFailureAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.GET_ACADEMIC_AGE_FAILURE, this.name);
  constructor(public name: string, public payload: any) { }
}

export class GetQuantityDistributionAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.GET_QUANTITY_DISTRIBUTION, this.name);
  constructor(public name: string, public payload: {
    label: string;
    query?: Queryable;
    filters?: Filterable[];
    field: string,
    queue: Array<Action>,
  }) { }
}

export class GetQuantityDistributionSuccessAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.GET_QUANTITY_DISTRIBUTION_SUCCESS, this.name);
  constructor(public name: string, public payload: any) { }
}

export class GetQuantityDistributionFailureAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.GET_QUANTITY_DISTRIBUTION_FAILURE, this.name);
  constructor(public name: string, public payload: any) { }
}

export class FindByIdInResourceAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.FIND_BY_ID_IN, this.name);
  constructor(public name: string, public payload: { ids: string[] }) { }
}

export class FindByIdInResourceSuccessAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.FIND_BY_ID_IN_SUCCESS, this.name);
  constructor(public name: string, public payload: any) { }
}

export class FindByIdInResourceFailureAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.FIND_BY_ID_IN_FAILURE, this.name);
  constructor(public name: string, public payload: any) { }
}

export class FindByTypesInResourceAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.FIND_BY_TYPES_IN, this.name);
  constructor(public name: string, public payload: { types: string[] }) { }
}

export class FindByTypesInResourceSuccessAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.FIND_BY_TYPES_IN_SUCCESS, this.name);
  constructor(public name: string, public payload: any) { }
}

export class FindByTypesInResourceFailureAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.FIND_BY_TYPES_IN_FAILURE, this.name);
  constructor(public name: string, public payload: any) { }
}

export class FetchLazyReferenceAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.FETCH_LAZY_REFERENCE, this.name);
  constructor(public name: string, public payload: { individual: any; field: string }) { }
}

export class FetchLazyReferenceSuccessAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.FETCH_LAZY_REFERENCE_SUCCESS, this.name);
  constructor(public name: string, public payload: { individual: any; field: string; resources: SdrCollection }) { }
}

export class FetchLazyReferenceFailureAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.FETCH_LAZY_REFERENCE_FAILURE, this.name);
  constructor(public name: string, public payload: any) { }
}

export class PostResourceAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.POST, this.name);
  constructor(public name: string, public payload: any) { }
}

export class PostResourceSuccessAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.POST_SUCCESS, this.name);
  constructor(public name: string, public payload: any) { }
}

export class PostResourceFailureAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.POST_FAILURE, this.name);
  constructor(public name: string, public payload: any) { }
}

export class PutResourceAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.PUT, this.name);
  constructor(public name: string, public payload: any) { }
}

export class PutResourceSuccessAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.PUT_SUCCESS, this.name);
  constructor(public name: string, public payload: any) { }
}

export class PutResourceFailureAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.PUT_FAILURE, this.name);
  constructor(public name: string, public payload: any) { }
}

export class PatchResourceAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.PATCH, this.name);
  constructor(public name: string, public payload: any) { }
}

export class PatchResourceSuccessAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.PATCH_SUCCESS, this.name);
  constructor(public name: string, public payload: any) { }
}

export class PatchResourceFailureAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.PATCH_FAILURE, this.name);
  constructor(public name: string, public payload: any) { }
}

export class DeleteResourceAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.DELETE, this.name);
  constructor(public name: string, public payload: any) { }
}

export class DeleteResourceSuccessAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.DELETE_SUCCESS, this.name);
  constructor(public name: string, public payload?: any) { }
}

export class DeleteResourceFailureAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.DELETE_FAILURE, this.name);
  constructor(public name: string, public payload: any) { }
}

export class ClearResourcesAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.CLEAR, this.name);
  constructor(public name: string, public payload?: any) { }
}

export class ClearAcademicAgeAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.CLEAR_ACADEMIC_AGE, this.name);
  constructor(public name: string, public payload?: any) { }
}

export class ClearResourceByIdAction implements Action {
  readonly type = getSdrAction(SdrActionTypes.CLEAR_RESOURCE_BY_ID, this.name);
  constructor(public name: string, public payload: { id: string }) { }
}

export type SdrActions =
  SelectResourceAction |
  SelectResourceSuccessAction |
  SelectResourceFailureAction |
  GetAllResourcesAction |
  GetAllResourcesSuccessAction |
  GetAllResourcesFailureAction |
  PageResourcesAction |
  PageResourcesSuccessAction |
  PageResourcesFailureAction |
  SearchResourcesAction |
  SearchResourcesSuccessAction |
  SearchResourcesFailureAction |
  CountResourcesAction |
  CountResourcesSuccessAction |
  CountResourcesFailureAction |
  RecentlyUpdatedResourcesAction |
  RecentlyUpdatedResourcesSuccessAction |
  RecentlyUpdatedResourcesFailureAction |
  GetOneResourceAction |
  GetOneResourceSuccessAction |
  GetOneResourceFailureAction |
  GetNetworkAction |
  GetNetworkSuccessAction |
  GetNetworkFailureAction |
  GetAcademicAgeAction |
  GetAcademicAgeSuccessAction |
  GetAcademicAgeFailureAction |
  GetQuantityDistributionAction |
  GetQuantityDistributionSuccessAction |
  GetQuantityDistributionFailureAction |
  FindByIdInResourceAction |
  FindByIdInResourceSuccessAction |
  FindByIdInResourceFailureAction |
  FindByTypesInResourceAction |
  FindByTypesInResourceSuccessAction |
  FindByTypesInResourceFailureAction |
  FetchLazyReferenceAction |
  FetchLazyReferenceSuccessAction |
  FetchLazyReferenceFailureAction |
  PostResourceAction |
  PostResourceSuccessAction |
  PostResourceFailureAction |
  PutResourceAction |
  PutResourceSuccessAction |
  PutResourceFailureAction |
  PatchResourceAction |
  PatchResourceSuccessAction |
  PatchResourceFailureAction |
  DeleteResourceAction |
  DeleteResourceSuccessAction |
  DeleteResourceFailureAction |
  ClearResourcesAction |
  ClearAcademicAgeAction |
  ClearResourceByIdAction;
