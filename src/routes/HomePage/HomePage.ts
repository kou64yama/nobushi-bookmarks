import Vue from 'vue';
import Component from 'vue-class-component';
import { mapGetters } from 'vuex';
import ItemList from '@/components/ItemList';

@Component({
  components: {
    ItemList,
  },
  computed: {
    ...mapGetters('auth', { owner: 'uid' }),
  },
})
export default class HomePage extends Vue {
  public owner?: string;

  public mounted() {
    this.$store.dispatch('document/setTitle', 'Home');
  }
}
