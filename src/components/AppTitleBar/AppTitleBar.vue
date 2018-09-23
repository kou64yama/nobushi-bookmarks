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
    <v-menu offset-y>
      <v-btn :disabled="!currentUser" color="red" class="btn mr-4" style="min-width: initial;" slot="activator">
        <v-icon class="mr-0">person</v-icon>
      </v-btn>
      <v-list two-line class="py-0" v-if="currentUser">
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
        <v-list-tile ref="signOut" @click="signOut">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Sign out</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-menu>
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
