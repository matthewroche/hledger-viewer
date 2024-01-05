<script setup lang="ts">

  import { type Ref, ref, onMounted, watch } from 'vue'
  import moment from 'moment'
  import PeriodSelector from '../components/PeriodSelector.vue'

  const periodValues = ref({
    startDate: moment().subtract(2, 'month').startOf('month').format("YYYY-MM-DD").toString(),
    endDate: moment().startOf('month').format("YYYY-MM-DD").toString(),
    interval: 'month'
  })
  const chartOptions = ref({
        chart: {
          id: "expenses-breakdown-graph",
          toolbar: {
            show: false,
          }
        },
        yaxis: {
          labels: {
            formatter: (value: number) => {return '£ '+value}
          }
        },
        colors: ['#FEDD00', '#FE5000', '#440099', '#0085CA', '#00AB84', '#FCAEBB', '#FF3EB5', '#00239C', '#EA7600', '#FF8DA1'],
        dataLabels: {
          enabled: false
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            borderRadiusApplication: 'end'
          }
        }
      })
  const series: Ref<[{name: String, data: [Number]}?]> = ref([])

  onMounted(async () => {
    getData()
  })

  watch(periodValues, async () => {
    getData()
  })

  const getData = (async () => {
    const isProd = window.location.href != 'http://localhost:5173/graphs/income-breakdown'
    const path = isProd ? "" : "http://localhost:3200"
    try {
      const response = await fetch(path+'/api/graphs/income-breakdown?' + new URLSearchParams({
        startDate: periodValues.value.startDate,
        endDate: periodValues.value.endDate,
        interval: periodValues.value.interval
      }));
      const parsedData = await response.json();
      
      chartOptions.value ={
        ...chartOptions.value,
        ...{
          xaxis: {
            categories: parsedData['dates']
          }
        }
      }

      series.value = []
      Object.keys(parsedData).forEach(element => {
        if (element != 'dates' && element != 'total') {
            series.value.push({"name": element, "data": parsedData[element].map((x: string) => Number(x.replace(/[^0-9.-]+/g,"")))})
        }
      });
      
    } catch (error) {
      console.error(error);
    }
  })

</script>

<template>
  <main>

    <h1 class="text-xl mb-4">Income Breakdown</h1>
    <PeriodSelector v-model:periodValues="periodValues" />
    <apexchart
      width="100%"
      type="bar"
      :options="chartOptions"
      :series="series"
    ></apexchart>

  </main>
</template>
