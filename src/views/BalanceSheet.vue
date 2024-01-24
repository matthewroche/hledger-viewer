<script setup lang="ts">

  import { ref, onMounted, watch } from 'vue'
  import PeriodSelector from '../components/PeriodSelector.vue'
  import moment from 'moment'
  import { VueToPrint } from "vue-to-print";

  const contentToPrint = ref();
  const periodValues = ref({
    startDate: moment().subtract(2, 'month').startOf('month').format("YYYY-MM-DD").toString(),
    endDate: moment().startOf('month').format("YYYY-MM-DD").toString(),
    interval: 'month'
  })
  const headers = ref<Array<String>>([])
  const assets = ref<Array<Array<string>>>([])
  const liabilities = ref<Array<Array<string>>>([])
  const netWorth = ref<Array<String>>([])

  onMounted(async () => {
    getData()
  })

  watch(periodValues, async () => {
    getData()
  })

  const getData = async () => {
    const isProd = import.meta.env.PROD
    const path = isProd ? "" : ("http://" + window.location.hostname + ":3200")
    try {
      const response = await fetch(path+'/api/balance-sheet?' + new URLSearchParams({
        startDate: periodValues.value.startDate,
        endDate: periodValues.value.endDate,
        interval: periodValues.value.interval
      }));
      
      const parsedData = await response.json();
      
      headers.value = parsedData[0].slice(1).map((date: string|number|Date) => {
        const d = new Date(date)
        switch (periodValues.value.interval) {
          case 'day':
            return d.toLocaleString('default', { day: 'numeric', month: 'numeric', year: 'numeric' });
          case 'month':
            return d.toLocaleString('default', { month: 'long' });
          case 'year':
          return d.toLocaleString('default', { year: 'numeric' });
        }
        
      });
      console.log(headers.value)

      const assetsIndex = parsedData.findIndex((row: string[]) => row[0] === 'Assets');
      const liabilitiesIndex = parsedData.findIndex((row: string[]) => row[0] === 'Liabilities')

      assets.value = parsedData.slice(assetsIndex + 1, liabilitiesIndex);
      liabilities.value = parsedData.slice(liabilitiesIndex + 1, parsedData.length - 2);
      netWorth.value = parsedData.slice(-2, -1)[0]
      
    } catch (error) {
      console.error(error);
    }
  }

  const getComponentToPrint = () => {
    return contentToPrint.value;
  };

</script>

<template>
  <main>

    <h1 class="text-xl md:mb-8">Balance Sheet</h1>
    <PeriodSelector class="my-4" v-model:periodValues="periodValues"/>
    <hr />
    <div ref="contentToPrint" class="flex flex-row pt-10 w-full overflow-y-scroll px-5">

      <div v-if="assets.length > 0" class="basis-1/3 shrink-0">

        <p class="opacity-0">Hidden</p>
      
        <p class="font-bold">Assets</p>
        <p v-for="(asset, index) in assets" v-bind:key="index" class="capitalize">{{ asset[0] }}</p>

        <p class="font-bold mt-5">Liabilities</p>
        <p v-for="(liability, index) in liabilities" v-bind:key="index" class="capitalize">{{ liability[0] }}</p>

        <p class="font-bold mt-5">Net</p>

      </div>

      <div class="grow"></div>

      <div v-for="(period, index) in headers" v-bind:key="index" class="flex flex-col basis-1/6 shrink-0 items-end">
        <p class="font-bold">{{period}}</p>
        <p v-if="period == undefined" class="opacity-0">Undefined</p>

        <p class="opacity-0">Hidden</p>
        <p v-for="(asset, assetIndex) in assets" v-bind:key="assetIndex" class="capitalize">{{ asset[index+1] }}</p>

        <p class="opacity-0 mt-5">Hidden</p>
        <p v-for="(liability, liabilityIndex) in liabilities" v-bind:key="liabilityIndex" class="capitalize">{{ liability[index+1] }}</p>

        <p class="mt-5">{{ netWorth[index+1] }}</p>
      
      </div>

    </div>
    <vue-to-print
      :content="getComponentToPrint"
      document-title="Balance Sheet"
      remove-after-print
    >
      <template #trigger>
        <div class="w-full flex justify-end">
          <button class="mt-10 p-2 border-2 rounded-lg hover:bg-slate-200">Print</button>
        </div>
      </template>
    </vue-to-print>
  </main>
</template>
