<script async setup lang="ts">
    defineProps(['periodValues'])
    defineEmits(['update:periodValues'])
</script>

<template>
  <main>
    <div class="flex md:m-4 justify-around flex-col md:flex-row">
      <div class="flex md:flex-col mb-2 md:mb-0">
        <p>From:</p>
        <div class="flex-grow md:hidden"></div>
        <input
          type="date" 
          :value="periodValues.startDate"
          @input=" event => {
            let target = event.target as HTMLInputElement
            let value = target.value || ''
            $emit('update:periodValues', {...periodValues,startDate: value})
          }"
        />
      </div>
      <div class="flex md:flex-col mb-2 md:mb-0">
        <p>To:</p>
        <div class="flex-grow md:hidden"></div>
        <input
          type="date" 
          :value="periodValues.endDate"
          @input=" event => {
            let target = event.target as HTMLInputElement
            let value = target.value || ''
            $emit('update:periodValues', {...periodValues,endDate: value})
          }"
        />
      </div>
      <div class="flex md:flex-col items-center md:items-start">
        <p>Interval:</p>
        <div class="flex-grow md:hidden"></div>
        <select @change="event => {
          let target = event.target as HTMLInputElement
          let value = target.value || ''
          $emit('update:periodValues', {...periodValues,interval: value})
        }">
        <option value="none" :selected="periodValues.interval == 'none'" @change="$emit('update:periodValues', {...periodValues,interval: 'none'})">None</option>
        <option value="day" :selected="periodValues.interval == 'day'" @change="$emit('update:periodValues', {...periodValues,interval: 'day'})">Day</option>
        <option value="month" :selected="periodValues.interval == 'month'" @change="$emit('update:periodValues', {...periodValues,interval: 'month'})">Month</option>
        <option value="year" :selected="periodValues.interval == 'year'" @change="$emit('update:periodValues', {...periodValues,interval: 'year'})">Year</option>
      </select>
      </div>
    </div>
  </main>
</template>