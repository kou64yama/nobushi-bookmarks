import Vue from 'vue';
import { mapActions, mapGetters, mapState } from 'vuex';

export default Vue.extend({
  computed: {
    ...mapGetters('app', ['platform']),
    ...mapState('document', ['title']),
    ...mapState('auth', ['currentUser']),
  },
  methods: {
    ...mapActions('app', ['close']),
    ...mapActions('auth', ['signOut']),
  },
});
