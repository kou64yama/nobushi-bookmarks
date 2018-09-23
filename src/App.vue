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
import { mapState } from 'vuex';
import AppTitleBar from '@/components/AppTitleBar';
import LoginPage from '@/routes/LoginPage';

export default Vue.extend({
  components: {
    AppTitleBar,
    LoginPage,
  },
  computed: {
    ...mapState('auth', ['currentUser']),
  },
})
</script>

<style src="../node_modules/vuetify/dist/vuetify.css"></style>

<style>
html {
  overflow-y: hidden;
}
</style>
