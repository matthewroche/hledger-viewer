<script setup>
    defineProps(['periodValues'])
    defineEmits(['update:periodValues'])
</script>

<template>
  <div class="flex m-4 justify-around">
      <div>
        <p>From:</p>
        <input
          type="date" 
          :value="periodValues.startDate"
          @input="$emit('update:periodValues', {...periodValues,startDate: $event.target.value})"
        />
      </div>
      <div class="flex flex-col">
        <p>To:</p>
        <input
          type="date" 
          :value="periodValues.endDate"
          @input="$emit('update:periodValues', {...periodValues,endDate: $event.target.value})"
        />
      </div>
      <div class="flex flex-col">
        <div>
          <input 
            type="radio" 
            id="none" 
            value="none" 
            :checked="periodValues.interval == 'none'"
            @change="$emit('update:periodValues', {...periodValues,interval: 'none'})"
            class="mr-5"/>
          <label for="day">None</label>  
        </div>
        <div>
          <input 
            type="radio" 
            id="day" 
            value="day" 
            :checked="periodValues.interval == 'day'"
            @change="$emit('update:periodValues', {...periodValues,interval: 'day'})"
            class="mr-5"/>
          <label for="day">Day</label>  
        </div>
        <div>
          <input 
            type="radio" 
            id="month" 
            value="month" 
            :checked="periodValues.interval == 'month'"
            @change="$emit('update:periodValues', {...periodValues,interval: 'month'})"
            class="mr-5"/>
          <label for="month">Month</label>
        </div>
        <div>
          <input 
            type="radio" 
            id="year" 
            value="year" 
            :checked="periodValues.interval == 'year'"
            @change="$emit('update:periodValues', {...periodValues,interval: 'year'})"
            class="mr-5"/>
          <label for="year">Year</label>
        </div>
      </div>
    </div>
</template>