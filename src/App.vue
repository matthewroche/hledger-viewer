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
  <div class="w-screen flex flex-col" style="height: 100svh;">
    <header class="w-full py-4 md:py-8 px-4 md:px-10 sticky top-0 bg-white border-b-2 z-50 flex items-center">  
      <router-link to="/" class="text-xl md:text-3xl font-bold">hLedger Viewer</router-link>
      <div class="flex-grow"></div>
      <div class="md:hidden hover:bg-slate-200 rounded h-10 w-10 flex content-center justify-center p-2" @click="menuOpen = !menuOpen">
        <p class="rotate-90">||||</p>
      </div>
    </header>
    <div class="w-screen flex flex-grow relative overflow-hidden">
      <div class="w-3/4 md:w-1/4 p-5 border-r-2 absolute top-0 bottom-0 overflow-scroll md:translate-x-0 transition-all ease-in-out delay-150" :class="menuOpen === true ? 'translate-x-0' : '-translate-x-full'">
          <p class="text-lg font-medium">Statements</p>
          <router-link to="/balance-sheet"><div class="hover:bg-slate-200 ml-5 h-10 p-2 rounded-lg flex items-center"><p>Balance Sheet</p></div></router-link>
          <router-link to="/balance-sheet-equity"><div class="hover:bg-slate-200 ml-5 h-10 p-2 rounded-lg flex items-center"><p>Balance Sheet Equity</p></div></router-link>
          <router-link to="/income-statement"><div class="hover:bg-slate-200 ml-5 h-10 p-2 rounded-lg flex items-center"><p>Income Statement</p></div></router-link>
          <router-link to="/cash-flow"><div class="hover:bg-slate-200 ml-5 h-10 p-2 rounded-lg flex items-center"><p>Cash Flow</p></div></router-link>
          <p class="text-lg font-medium">Graphs</p>
          <router-link to="/graphs/expenses-breakdown"><div class="hover:bg-slate-200 ml-5 h-10 p-2 rounded-lg flex items-center"><p>Expenses</p></div></router-link>
          <router-link to="/graphs/income-breakdown"><div class="hover:bg-slate-200 ml-5 h-10 p-2 rounded-lg flex items-center"><p>Income</p></div></router-link>
          <router-link to="/graphs/income-vs-expenses"><div class="hover:bg-slate-200 ml-5 h-10 p-2 rounded-lg flex items-center"><p>Income vs Expenses</p></div></router-link>
          <router-link to="/graphs/assets-vs-liabilities"><div class="hover:bg-slate-200 ml-5 h-10 p-2 rounded-lg flex items-center"><p>Assets vs Liabilities</p></div></router-link>
          <router-link to="/graphs/net-worth"><div class="hover:bg-slate-200 ml-5 h-10 p-2 rounded-lg flex items-center"><p>Net Worth</p></div></router-link>
      </div>
      <div class="md:left-1/4 absolute top-0 bottom-0 overflow-scroll w-full md:w-3/4 transition-all ease-in-out delay-150" :class="menuOpen === true ? 'translate-x-3/4 opacity-25' : 'translate-x-0'">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
