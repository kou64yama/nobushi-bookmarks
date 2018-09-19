import Vue from 'vue';
import Component from 'vue-class-component';

export class HomePage extends Vue {
  public mounted() {
    this.$store.dispatch('document/setTitle', 'Home');
  }
}

export default Component({})(HomePage);
