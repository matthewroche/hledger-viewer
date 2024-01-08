<script setup lang="ts">

import { ref, onMounted } from 'vue'

const hledgerAccessible = ref(true)
const mainFile = ref('')
const transactionsCount = ref('')
const lastTransaction = ref('')
const accountsCount = ref('')
const commoditiesCount = ref('')


const getData = async () => {
    const isProd = window.location.href != 'http://localhost:5173/'
    const path = isProd ? "" : "http://localhost:3200"
    try {
      const response = await fetch(path+'/api/stats');

      let output = await response.json()

      mainFile.value = output.mainFile
      transactionsCount.value = output.transactionsCount
      lastTransaction.value = output.lastTransaction
      accountsCount.value = output.accountsCount
      commoditiesCount.value = output.commoditiesCount
      
    } catch (error) {
      console.error(error);
      hledgerAccessible.value = false
    }
  }

  onMounted(async () => {
    getData()
  })

</script>

<template>
  <main class="">

    <div v-if="hledgerAccessible">
      <p class="text-xl mb-5">Statistics</p>
      <div class="flex flex-col md:flex-row mb-2">
        <p class="font-bold mr-5">Main File:</p>
        <p>{{ mainFile }}</p>
      </div>
      <div class="flex flex-col md:flex-row mb-2">
        <p class="font-bold mr-5">Transactions:</p>
        <p>{{ transactionsCount }}</p>
      </div>
      <div class="flex flex-col md:flex-row mb-2">
        <p class="font-bold mr-5">Last Transaction:</p>
        <p>{{ lastTransaction }}</p>
      </div>
      <div class="flex flex-col md:flex-row mb-2">
        <p class="font-bold mr-5">Accounts:</p>
        <p>{{ accountsCount }}</p>
      </div>
      <div class="flex flex-col md:flex-row mb-2">
        <p class="font-bold mr-5">Commodities:</p>
        <p>{{ commoditiesCount }}</p>
      </div>
    </div>

    <div v-if="!hledgerAccessible">
      <p>Hledger not accessible</p>
    </div>
    

  </main>
</template>
