import document, { State as DocumentState } from './document';

export interface State {
  document: DocumentState;
}

export default {
  document,
};
