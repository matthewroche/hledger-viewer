<script setup lang="ts">

  import { ref, onMounted, watch } from 'vue'
  import moment from 'moment'
  import PeriodSelector from '../components/PeriodSelector.vue'

  const periodValues = ref({
    startDate: moment().subtract(2, 'month').startOf('month').format("YYYY-MM-DD").toString(),
    endDate: moment().startOf('month').format("YYYY-MM-DD").toString(),
    interval: 'month'
  })
  const chartOptions = ref({
        chart: {
          id: "net-worth-graph",
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
        }
      })
  const series = ref([
        {
          name: "Net Worth",
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
    const isProd = window.location.href != 'http://localhost:5173/graphs/net-worth'
    const path = isProd ? "" : "http://localhost:3200"
    try {
      const response = await fetch(path+'/api/graphs/net-worth?' + new URLSearchParams({
        startDate: periodValues.value.startDate,
        endDate: periodValues.value.endDate,
        interval: periodValues.value.interval
      }));
      const parsedData = await response.json();


      const chartType = periodValues.value.interval == 'day' ? 'datetime' : 'category'
      console.log(chartType);
      
      let chartCategories = parsedData[0]
      switch (periodValues.value.interval) {
        case 'day': chartCategories = parsedData[0]; break;
        case 'month': chartCategories = parsedData[0].map((x: string|number|Date) => {
            const d = new Date(x)
            return d.toLocaleDateString('default', {month: 'long'})
          }); break;
        case 'year': chartCategories = parsedData[0].map((x: string|number|Date) => {
            const d = new Date(x)
            return d.toLocaleDateString('default', {year: 'numeric'})
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
      series.value[0].data = parsedData[1].map((x: string) => Number(x.replace(/[^0-9.-]+/g,""))); //Removing cuurency sympol and converting string to number
    } catch (error) {
      console.error(error);
    }
  })

</script>

<template>
  <main>

    <h1 class="text-xl mb-4">Net Worth</h1>
    <PeriodSelector v-model:periodValues="periodValues" />
    <apexchart
      width="100%"
      type="line"
      :options="chartOptions"
      :series="series"
    ></apexchart>

  </main>
</template>
