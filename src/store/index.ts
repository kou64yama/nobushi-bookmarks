import document, { State as DocumentState } from './document';
import auth, { State as AuthState } from './auth';

export interface State {
  document: DocumentState;
  auth: AuthState;
}

export default {
  document,
  auth,
};
