import * as fromStore from './root-store.actions';

function merge(over: any, under: any): any {
  return Object.entries(over).reduce(
      (prev, [key, value]) => ({
          ...prev,
          [key]: value,
      }),
      under
  );
}

export function universalMetaReducer(reducer) {
  return (state, action) => {
    switch (action.type) {
      case fromStore.StoreActionTypes.REHYDRATE:
        const rehydrated = merge(state, action.payload.state);
        return reducer(rehydrated, action);
      default:
        break;
    }
    return reducer(state, action);
  };
}
