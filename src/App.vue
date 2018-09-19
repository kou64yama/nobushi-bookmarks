<template>
  <v-app id="app">
    <v-system-bar app dark window color="primary" v-if="platform ==='darwin'">
      <v-spacer/>
      {{ title }}
      <v-spacer/>
    </v-system-bar>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({})
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
