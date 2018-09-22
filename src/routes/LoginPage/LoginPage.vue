<template>
  <v-container fill-height justify-center>
    <v-progress-circular indeterminate size="64" color="primary" v-if="loading"/>
    <v-layout justify-center align-center v-else>
      <v-flex xs12 sm10 md8 lg6 xl4>
        <h1>Log in</h1>
        <v-text-field
          label="Email"
          v-model="email"
          @keyup.enter="signIn"
        />
        <v-text-field
          label="Password"
          type="password"
          v-model="password"
          @keyup.enter="signIn"
        />
        <v-btn block color="primary" @click.native="signIn">
          Log in
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts" src="./LoginPage.ts"></script>
