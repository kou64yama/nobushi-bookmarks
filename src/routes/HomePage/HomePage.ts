import Vue from 'vue';
import Component from 'vue-class-component';

@Component({})
export default class HomePage extends Vue {
  public mounted() {
    this.$store.dispatch('document/setTitle', 'Home');
  }
}
