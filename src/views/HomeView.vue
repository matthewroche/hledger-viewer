<script setup lang="ts">

import { ref, onMounted } from 'vue'

const hledgerAccessible = ref(true)
const mainFile = ref('')
const transactionsCount = ref('')
const lastTransaction = ref('')
const accountsCount = ref('')
const commoditiesCount = ref('')


const getData = async () => {
    const isProd = import.meta.env.PROD
    const path = isProd ? "" : ("http://" + window.location.hostname + ":3200")
    console.log(path)
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

    <div v-if="hledgerAccessible" class="p-5">
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
