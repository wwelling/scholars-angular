import * as fromStore from './root-store.actions';

function merge(from: any, into: any): any {
  return Object.entries(from).reduce(
      (prev, [key, value]) => ({
          ...prev,
          [key]: value,
      }),
      into
  );
}

export function universalMetaReducer(reducer) {
  return (state, action) => {
    if (action.type === fromStore.StoreActionTypes.REHYDRATE) {
      return reducer(merge(state, action.payload.state), action);
    }

    return reducer(state, action);
  };
}
