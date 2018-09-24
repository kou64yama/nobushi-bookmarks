import Vue from 'vue';
import { mapGetters, mapState } from 'vuex';

export default Vue.extend({
  computed: {
    ...mapGetters(['close', 'platform']),
    ...mapState('document', ['title']),
  },
});
