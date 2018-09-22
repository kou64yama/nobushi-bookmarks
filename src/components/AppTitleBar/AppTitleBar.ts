import Vue from 'vue';
import Component from 'vue-class-component';
import { mapActions, mapGetters, mapState } from 'vuex';

@Component({
  computed: {
    ...mapGetters('app', ['platform']),
    ...mapState('document', ['title']),
    ...mapState('auth', ['currentUser']),
  },
  methods: {
    ...mapActions('app', ['close']),
    ...mapActions('auth', ['signOut']),
  },
})
export default class AppTitleBar extends Vue {}
