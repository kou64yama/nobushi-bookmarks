<template>
  <v-app>
    <app-title-bar/>
    <v-content>
      <router-view/>
      <router-view name="fab"/>
    </v-content>
  </v-app>
</template>

<script lang="ts" src="./RootLayout.ts"></script>
