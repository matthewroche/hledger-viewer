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
    const isProd = import.meta.env.PROD
    const path = isProd ? "" : ("http://" + window.location.hostname + ":3200")
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
  <main class="h-full flex flex-col">
    <h1 class="text-xl mb-4">Income Breakdown</h1>
    <PeriodSelector v-model:periodValues="periodValues" />
    <div class="w-full md:w-8/12 mx-auto flex-grow">
      <apexchart
        width="100%"
        height="100%"
        type="bar"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </div>
  </main>
</template>
