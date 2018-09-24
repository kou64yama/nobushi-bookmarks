import document, { State as DocumentState } from './document';
import items, { State as ItemsState } from './items';

export interface State {
  document: DocumentState;
  items: ItemsState;
}

export default {
  document,
  items,
};
