<script setup lang="ts">

  import { type Ref, ref, onMounted, watch } from 'vue'
  import moment from 'moment'
  import PeriodSelector from '../components/PeriodSelector.vue'
  import { type ApexOptions } from 'apexcharts'

  const periodValues = ref({
    startDate: moment().subtract(2, 'month').startOf('month').format("YYYY-MM-DD").toString(),
    endDate: moment().startOf('month').format("YYYY-MM-DD").toString(),
    interval: 'month'
  })
  const chartOptions: Ref<ApexOptions> = ref({
        chart: {
          id: "income-vs-expenses-graph",
          stacked: true,
          toolbar: {
            show: false,
          }
        },
        xaxis: {
          type: 'category',
          categories: [],
          tickAmount: undefined
        },
        yaxis: {
          labels: {
            formatter: (value: number) => {return '£ '+value}
          }
        },
        dataLabels: {
          enabled: false
        },
        colors: ['#008FFB', '#FF4560', '#FFE91F'],
        plotOptions: {
          bar: {
            borderRadius: 10,
            borderRadiusWhenStacked: 'all',
            borderRadiusApplication: 'end'
          }
        },
        markers: {
            size: 4
        }
      })
  const series = ref([
        {
          name: "Income",
          type: "column",
          data: [],
        },
        {
          name: "Expenses",
          type: "column",
          data: [],
        },
        {
          name: "Total",
          type: "line",
          data: [],
        },
      ])

  onMounted(async () => {
    getData()
  })

  watch(periodValues, async () => {
    getData()
  })

  const getData = (async () => {
    const isProd = import.meta.env.PROD
    const path = isProd ? "" : "http://localhost:3200"
    try {
      const response = await fetch(path+'/api/graphs/income-vs-expenses?' + new URLSearchParams({
        startDate: periodValues.value.startDate,
        endDate: periodValues.value.endDate,
        interval: periodValues.value.interval
      }));
      const parsedData = await response.json();

      const chartType = periodValues.value.interval == 'day' ? 'datetime' : 'category'
      
      let chartCategories = parsedData['dates']
      switch (periodValues.value.interval) {
        case 'day': chartCategories = parsedData['dates']; break;
        case 'month': chartCategories = parsedData['dates']; break;
        case 'year': chartCategories = parsedData['dates'].map((x: string) => {
            return x.split("-")[0]
          }); break;
      }
      
      chartOptions.value ={
        ...chartOptions.value,
        ...{
          xaxis: {
            type: chartType,
            categories: chartCategories,
            tickAmount: 10
          }
        }
      }
      series.value[0].data = parsedData['Income'].map((x: string) => Number(x.replace(/[^0-9.-]+/g,""))); //Removing cuurency sympol and converting string to number
      series.value[1].data = parsedData['Expenses'].map((x: string) => Number(x.replace(/[^0-9.-]+/g,"")));
      series.value[2].data = parsedData['Total'].map((x: string) => Number(x.replace(/[^0-9.-]+/g,"")));
      

    } catch (error) {
      console.error(error);
    }
  })

</script>

<template>
  <main class="flex flex-col h-full">

    <h1 class="text-xl mb-4">Income vs Expenses</h1>
    <PeriodSelector v-model:periodValues="periodValues" />
    <div class="w-full md:w-8/12 mx-auto flex-grow">
      <apexchart
        width="100%"
        heigh="100%"
        type="line"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </div>
  </main>
</template>
