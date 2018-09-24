import Vue from 'vue';
import { mapActions, mapState } from 'vuex';

export default Vue.extend({
  computed: {
    ...mapState('items', ['cache']),
  },
  methods: {
    ...mapActions('items', ['remove']),
  },
});
