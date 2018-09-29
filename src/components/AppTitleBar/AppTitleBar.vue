<template>
  <v-system-bar
    app
    dark
    window
    color="primary"
    class="title-bar"
  >
    <v-spacer/>
    {{ title }}
    <v-spacer/>
    <v-icon ref="close" class="btn" @click="close" v-if="platform !== 'darwin'">
      close
    </v-icon>
  </v-system-bar>
</template>

<script lang="ts" src="./AppTitleBar.ts"></script>

<style scoped>
.title-bar {
  -webkit-app-region: drag;
  user-select: none;
}

.btn {
  -webkit-app-region: no-drag;
  cursor: pointer;
}
</style>
