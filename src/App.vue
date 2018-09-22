<template>
  <v-app id="app">
    <v-system-bar app dark window color="primary" v-if="platform ==='darwin'">
      <v-spacer/>
      {{ title }}
      <v-spacer/>
    </v-system-bar>
    <v-toolbar app dark color="primary" v-if="currentUser">
      <v-spacer/>
      <v-menu offset-y>
        <v-btn icon slot="activator">
          <img :src="currentUser.photoURL" v-if="currentUser.photoURL">
          <v-icon v-else>person</v-icon>
        </v-btn>
        <v-list two-line class="py-0">
          <v-list-tile>
            <v-list-tile-avatar color="grey lighten-1">
              <img :src="currentUser.photoURL" v-if="currentUser.photoURL">
              <v-icon color="white" v-else>person</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ currentUser.displayName || currentUser.email || currentUser.uid }}
              </v-list-tile-title>
              <v-list-tile-sub-title>
                {{ currentUser.email }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-divider/>
        <v-list class="py-0">
          <v-list-tile @click="signOut">
            <v-list-tile-action>
              <v-icon>exit_to_app</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Sign out</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-content>
      <router-view v-if="currentUser"/>
      <login-page v-else/>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { mapActions, mapState } from 'vuex';
import LoginPage from '@/routes/LoginPage';

@Component({
  components: {
    LoginPage,
  },
  computed: {
    ...mapState('auth', ['currentUser']),
  },
  methods: {
    ...mapActions('auth', ['signOut']),
  },
})
export default class App extends Vue {
  public get platform(): string {
    return process.platform;
  }

  public get title(): string {
    return this.$store.state.document.title;
  }
}
</script>

<style src="../node_modules/vuetify/dist/vuetify.css"></style>
