import Vue from 'vue';
import Component from 'vue-class-component';
import { mapGetters, mapState } from 'vuex';

interface ValidationError extends Error {
  details: {
    path: string;
    message: string;
  }[];
}

@Component({
  computed: {
    ...mapGetters('items', ['getFieldErrors']),
    ...mapState('items', ['loading']),
  },
  watch: {
    open(this: AddItem) {
      this.name = '';
      this.url = '';
      this.description = '';
      this.$store.dispatch('items/clearError');
    },
  },
})
export default class AddItem extends Vue {
  public open = false;
  public name = '';
  public url = '';
  public description = '';

  public async submit() {
    const owner = this.$store.getters['auth/uid'];
    await this.$store.dispatch('items/add', {
      owner,
      name: this.name,
      url: this.url,
      description: this.description,
    });

    if (!this.$store.state.items.error) {
      this.open = false;
    }
  }
}
