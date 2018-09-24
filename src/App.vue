<template>
  <root-layout id="app"/>
</template>

<script lang="ts">
import Vue from 'vue';
import RootLayout from '@/components/RootLayout';

export default Vue.extend({
  components: {
    RootLayout,
  },
});
</script>

<style src="../node_modules/vuetify/dist/vuetify.css"></style>

<style>
html {
  overflow-y: hidden;
}
</style>
