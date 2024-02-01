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
  const cashFlows = ref<Array<Array<string>>>([])
  const net = ref<Array<String>>([])

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
      const response = await fetch(path+'/api/cash-flow?' + new URLSearchParams({
        startDate: periodValues.value.startDate,
        endDate: periodValues.value.endDate,
        interval: periodValues.value.interval
      }));
      
      const parsedData = await response.json();

      console.log(parsedData);

      headers.value = parsedData[0].slice(1).map((date: string) => {
        let d = new Date(date)
        switch (periodValues.value.interval) {
          case 'day':
            return d.toLocaleString('default', { day: 'numeric', month: 'numeric', year: 'numeric' });
          case 'month':
            return date;
          case 'year':
            d = new Date(date.split('..')[0])
            return d.toLocaleString('default', { year: 'numeric' });
        }
      });

      const cashFlowsIndex = parsedData.findIndex((row: string[]) => row[0] === 'Cash flows');

      cashFlows.value = parsedData.slice(cashFlowsIndex + 1, parsedData.length - 1);
      net.value = parsedData.slice(-1)[0]
      
      
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

    <h1 class="text-xl md:mb-8 pt-5 pl-5 font-bold">Cash Flow</h1>
    <PeriodSelector class="my-4 px-5" v-model:periodValues="periodValues" />
    <hr />

    <div ref="contentToPrint" class="pt-10 w-full overflow-y-scroll">
      <p class="hidden text-3xl font-bold pl-5">Cash Flow</p>
      <div class="flex flex-row">

        <div v-if="cashFlows.length > 0" class="basis-1/3 shrink-0 ml-5 mr-10">

          <p class="opacity-0">Hidden</p>

          <p class="font-bold">Cash Flows</p>
          <p v-for="(revenue, index) in cashFlows" v-bind:key="index" class="capitalize">{{ revenue[0] }}</p>

          <p class="font-bold mt-5">Net</p>

        </div>

        <div class="grow"></div>

        <div v-for="(period, index) in headers" v-bind:key="index" class="flex flex-col basis-1/6 shrink-0 items-end pr-10">
          <p class="font-bold">{{period}}</p>

          <p class="opacity-0">Hidden</p>
          <p v-for="(revenue, revenueIndex) in cashFlows" v-bind:key="revenueIndex" class="capitalize">{{ revenue[index+1] }}</p>

          <p class="mt-5">{{ net[index+1] }}</p>

        </div>
      </div>
    </div>
    <vue-to-print
      :content="getComponentToPrint"
      document-title="Balance Sheet"
      remove-after-print
      pageStyle="p {display: block !important;}"
    >
      <template #trigger>
        <div class="w-full flex justify-end">
          <button class="m-5 p-2 border-2 rounded-lg hover:bg-slate-200">Print</button>
        </div>
      </template>
    </vue-to-print>

  </main>
</template>
