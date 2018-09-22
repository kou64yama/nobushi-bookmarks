<template>
  <v-app id="app">
    <app-title-bar/>
    <v-content>
      <router-view v-if="currentUser"/>
      <login-page v-else/>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { mapState } from 'vuex';
import AppTitleBar from '@/components/AppTitleBar';
import LoginPage from '@/routes/LoginPage';

@Component({
  components: {
    AppTitleBar,
    LoginPage,
  },
  computed: {
    ...mapState('auth', ['currentUser']),
  },
})
export default class App extends Vue {
}
</script>

<style src="../node_modules/vuetify/dist/vuetify.css"></style>

<style>
html {
  overflow-y: hidden;
}
</style>
