import { inspect, InspectOptions } from 'util';
import { Plugin } from 'vuex';

export default function createLogger<S>(options: InspectOptions): Plugin<S> {
  return store => {
    store.subscribe(mutation => {
      const { type, payload } = mutation;
      console.info(`* ${type} ${inspect(payload, options)}`);
    });
  };
}
