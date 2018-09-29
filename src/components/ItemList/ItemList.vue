<template>
  <v-list two-line class="py-0">
    <template v-for="(doc, i) in cache">
      <v-list-tile
        :key="`item.${doc.id}`"
        :href="doc.data.url"
        target="_blank"
        rel="noopenner noreferrer"
        class="item"
      >
        <v-list-tile-content>
          <v-list-tile-title>
            {{ doc.data.name }}
          </v-list-tile-title>
          <v-list-tile-sub-title>
            {{ doc.data.url }}
          </v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action class="action">
          <v-btn icon @click.native.stop="remove(doc.id)">
            <v-icon color="grey">delete</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>
      <v-divider :key="`divider.${i}`"/>
    </template>
  </v-list>
</template>

<script lang="ts" src="./ItemList.ts"></script>

<style scoped>
.item:not(:hover) .action {
  display: none;
}
</style>
