import { CollectionView, OpKey } from './';

export interface Grouping {
  readonly field: string;
  readonly opKey: OpKey;
  readonly options: string[];
}

export interface DirectoryView extends CollectionView {
  readonly grouping: Grouping;
}
