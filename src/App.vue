<script async setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from "vue-router";
import { RouterLink, RouterView } from 'vue-router'

const menuOpen = ref(false)

const route = useRoute();

watch(
  () => route.fullPath,
  async () => {
    menuOpen.value = false
  }
);

</script>

<template>
  <div class="w-screen h-screen flex flex-col">
    <header class="w-full py-4 md:py-8 px-4 md:px-10 sticky top-0 bg-white border-b-2 z-50 flex items-center">  
      <router-link to="/" class="text-xl md:text-3xl">hLedger Viewer</router-link>
      <div class="flex-grow"></div>
      <p class="md:hidden rotate-90 hover:bg-slate-200 p-2 rounded" @click="menuOpen = !menuOpen">||||</p>
    </header>
    <div class="w-screen flex flex-grow relative overflow-hidden">
      <div class="w-3/4 md:w-1/4 p-5 border-r-2 absolute top-0 bottom-0 overflow-scroll transition-all ease-in-out delay-150" :class="menuOpen === true ? 'translate-x-0' : '-translate-x-full'">
          <p class="text-lg font-medium">Statements</p>
          <router-link to="/balance-sheet"><p class="hover:bg-slate-200 ml-5">Balance Sheet</p></router-link>
          <router-link to="/balance-sheet-equity"><p class="hover:bg-slate-200 ml-5">Balance Sheet Equity</p></router-link>
          <router-link to="/income-statement"><p class="hover:bg-slate-200 ml-5">Income Statement</p></router-link>
          <router-link to="/cash-flow"><p class="hover:bg-slate-200 ml-5">Cash Flow</p></router-link>
          <p class="text-lg font-medium">Graphs</p>
          <router-link to="/graphs/expenses-breakdown"><p class="hover:bg-slate-200 ml-5">Expenses</p></router-link>
          <router-link to="/graphs/income-breakdown"><p class="hover:bg-slate-200 ml-5">Income</p></router-link>
          <router-link to="/graphs/income-vs-expenses"><p class="hover:bg-slate-200 ml-5">Income vs Expenses</p></router-link>
          <router-link to="/graphs/assets-vs-liabilities"><p class="hover:bg-slate-200 ml-5">Assets vs Liabilities</p></router-link>
          <router-link to="/graphs/net-worth"><p class="hover:bg-slate-200 ml-5">Net Worth</p></router-link>
      </div>
      <div class="p-5 md:left-1/4 absolute top-0 bottom-0 overflow-scroll w-full md:w-3/4 transition-all ease-in-out delay-150" :class="menuOpen === true ? 'translate-x-3/4' : 'translate-x-0'">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
