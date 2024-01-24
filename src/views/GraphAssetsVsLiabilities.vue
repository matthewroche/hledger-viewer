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
          id: "assets-vs-liabilities-graph",
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
          name: "Assets",
          type: "column",
          data: [],
        },
        {
          name: "Liabilities",
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
    const path = isProd ? "" : ("http://" + window.location.hostname + ":3200")
    try {
      const response = await fetch(path+'/api/graphs/assets-vs-liabilities?' + new URLSearchParams({
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
            categories: chartCategories
          }
        }
      }
      series.value[0].data = parsedData['Assets'].map((x: string) => Number(x.replace(/[^0-9.-]+/g,""))); //Removing cuurency sympol and converting string to number
      series.value[1].data = parsedData['Liabilities'].map((x: string) => Number(x.replace(/[^0-9.-]+/g,"")));
      series.value[2].data = parsedData['Total'].map((x: string) => Number(x.replace(/[^0-9.-]+/g,"")));
      

    } catch (error) {
      console.error(error);
    }
  })

</script>

<template>
  <main class="h-full flex flex-col">

    <h1 class="text-xl mb-4 pt-5 pl-5">Assets vs Liabilities</h1>
    <PeriodSelector class="px-5" v-model:periodValues="periodValues" />
    <div class="w-full md:w-8/12 mx-auto flex-grow">
      <apexchart
      width="100%"
      height="100%"
      type="line"
      :options="chartOptions"
      :series="series"
    ></apexchart>
    </div>

  </main>
</template>
