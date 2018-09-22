import { ActionContext } from 'vuex';

declare global {
  const __DEV__: boolean;

  type ActionHandler<S, R> = (
    injectee: ActionContext<S, R>,
    payload?: any,
  ) => any;
}
