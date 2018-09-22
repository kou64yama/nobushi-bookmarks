import Vue from 'vue';
import Component from 'vue-class-component';
import { mapState } from 'vuex';

@Component({
  computed: {
    ...mapState('auth', ['loading']),
  },
})
export default class LoginPage extends Vue {
  public email = '';
  public password = '';

  public mounted() {
    this.$store.dispatch('document/setTitle', 'Log in');
  }

  public signIn() {
    this.$store.dispatch('auth/signInWithEmailAndPassword', {
      email: this.email,
      password: this.password,
    });
  }
}
