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
  const revenues = ref<Array<Array<string>>>([])
  const expenses = ref<Array<Array<string>>>([])
  const net = ref<Array<String>>([])

  onMounted(async () => {
    getData()
  })

  watch(periodValues, async () => {
    getData()
  })

  const getData = async () => {
    const isProd = window.location.href != 'http://localhost:5173/income-statement'
    const path = isProd ? "" : "http://localhost:3200"
    try {
      const response = await fetch(path+'/api/income-statement?' + new URLSearchParams({
        startDate: periodValues.value.startDate,
        endDate: periodValues.value.endDate,
        interval: periodValues.value.interval
      }));
      
      const parsedData = await response.json();

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

      const revenuesIndex = parsedData.findIndex((row: string[]) => row[0] === 'Revenues');
      const expensesIndex = parsedData.findIndex((row: string[]) => row[0] === 'Expenses')

      revenues.value = parsedData.slice(revenuesIndex + 1, expensesIndex);
      expenses.value = parsedData.slice(expensesIndex + 1, parsedData.length - 1);
      net.value = parsedData.slice(-2, -1)[0]
      
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

    <h1 class="text-xl md:mb-8">Income Statement</h1>
    <PeriodSelector class="my-4" v-model:periodValues="periodValues"/>
    <hr />

    <div ref="contentToPrint" class="flex flex-row pt-10 w-full overflow-scroll px-5">

      <div v-if="revenues.length > 0" class="basis-1/3 shrink-0">

        <p class="opacity-0">Hidden</p>

        <p class="font-bold">Revenues</p>
        <p v-for="(revenue, index) in revenues" v-bind:key="index" class="capitalize">{{ revenue[0] }}</p>

        <p class="font-bold mt-5">Expenses</p>
        <p v-for="(expense, index) in expenses" v-bind:key="index" class="capitalize">{{ expense[0] }}</p>

        <p class="font-bold mt-5">Net</p>

      </div>

      <div class="grow"></div>

      <div v-for="(period, index) in headers" v-bind:key="index" class="flex flex-col basis-1/6 shrink-0 items-end">
        <p class="font-bold">{{period}}</p>

        <p class="opacity-0">Hidden</p>
        <p v-for="(revenue, revenueIndex) in revenues" v-bind:key="revenueIndex" class="capitalize">{{ revenue[index+1] }}</p>

        <p class="opacity-0 mt-5">Hidden</p>
        <p v-for="(expense, lexpensesIndex) in expenses" v-bind:key="lexpensesIndex" class="capitalize">{{ expense[index+1] }}</p>

        <p class="mt-5">{{ net[index+1] }}</p>

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
