<script async setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

</script>

<template>
  <header class="container mx-auto m-10">  
    <router-link to="/" class="text-3xl">hLedger Visualisation</router-link>
  </header>

  <RouterView class="container mx-auto m-10"/>
</template>

<style scoped>
</style>
