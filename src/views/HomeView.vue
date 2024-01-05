<script setup lang="ts">

</script>

<template>
  <main>

    <h1 class="text-xl mb-4">Home</h1>
    <hr />
    <h3 class="text-l my-4">Statements</h3>
    <div class="flex mb-4">
      <router-link to="/balance-sheet" class="mx-4 p-2 border-2 rounded-lg hover:bg-slate-200">Balance Sheet</router-link>
      <router-link to="/balance-sheet-equity" class="mx-4 p-2 border-2 rounded-lg hover:bg-slate-200">Balance Sheet Equity</router-link>
      <router-link to="/income-statement" class="mx-4 p-2 border-2 rounded-lg hover:bg-slate-200">Income Statement</router-link>
      <router-link to="/cash-flow" class="mx-4 p-2 border-2 rounded-lg hover:bg-slate-200">Cash Flow</router-link>

    </div>
    <hr />
    <h3 class="text-l my-4">Graphs</h3>
    <div class="flex">
      <router-link to="/graphs/net-worth" class="mx-4 p-2 border-2 rounded-lg hover:bg-slate-200">Net Worth</router-link>
      <router-link to="/graphs/expenses-breakdown" class="mx-4 p-2 border-2 rounded-lg hover:bg-slate-200">Expenses Breakdown</router-link>
      <router-link to="/graphs/income-breakdown" class="mx-4 p-2 border-2 rounded-lg hover:bg-slate-200">Income Breakdown</router-link>
      <router-link to="/graphs/income-vs-expenses" class="mx-4 p-2 border-2 rounded-lg hover:bg-slate-200">Income Vs Expenses</router-link>
      <router-link to="/graphs/assets-vs-liabilities" class="mx-4 p-2 border-2 rounded-lg hover:bg-slate-200">Assets Vs Liabilities</router-link>
    </div>

  </main>
</template>
