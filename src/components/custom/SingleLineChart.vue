<script setup>
import { ref, onMounted } from "vue";
import useDatetime from "@/composables/utils/useDateTime";

const props = defineProps({
  // array of objects with date and value
  data: Array,
  title: String,
  intervalFilter: {
    type: Boolean,
    default: true,
  },
});

const { orderObjectsByDate, getMonthNames } = useDatetime();

const from = ref();
const to = ref();
const documentStyle = getComputedStyle(document.body);
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        color: documentStyle.getPropertyValue("--text-color"),
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: documentStyle.getPropertyValue("--text-color-secondary"),
      },
      grid: {
        color: documentStyle.getPropertyValue("--surface-border"),
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: documentStyle.getPropertyValue("--text-color-secondary"),
      },
      grid: {
        color: documentStyle.getPropertyValue("--surface-border"),
      },
    },
  },
};

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: props.title,
      data: [],
      fill: false,
      borderColor: documentStyle.getPropertyValue("--primary-500"),
      backgroundColor: documentStyle.getPropertyValue("--primary-500"),
      tension: 0.3,
    },
  ],
});

function buildData(dataArray) {
  const orderedData = orderObjectsByDate(dataArray, "created_at");

  chartData.value.labels = getMonthNames(
    orderedData,
    "created_at",
    from.value,
    to.value
  );

  let tempData = [];

  for (let i = 0; i < orderedData.length; i++) {
    tempData.push(orderedData[i].value);
  }

  chartData.value.datasets[0].data = tempData;
}

function setupComponent() {
  const dataArray = orderObjectsByDate(props.data, "created_at");

  from.value = new Date(props.data[0].created_at);
  to.value = new Date(props.data[props.data.length - 1].created_at);

  buildData(dataArray);
}

function updateData() {
  let dataArray = [];
  const originalData = JSON.parse(JSON.stringify(props.data));

  from.value.setHours(0, 0, 0, 0);
  to.value.setHours(23, 59, 59, 999);

  for (let i = 0; i < props.data.length; i++) {
    if (
      new Date(originalData[i].created_at) >= from.value &&
      new Date(originalData[i].created_at) <= to.value
    ) {
      dataArray.push(originalData[i]);
    }
  }

  buildData(dataArray);
}

onMounted(() => {
  setupComponent();
});
</script>

<template>
  <div class="w-full flex flex-column">
    <div
      v-if="intervalFilter"
      class="w-full flex justify-content-start align-items-end gap-3 mb-3"
    >
      <div class="flex flex-column">
        <span>Desde</span>
        <Calendar
          v-model="from"
          :manualInput="true"
          :minDate="new Date(props.data[0].created_at)"
          :maxDate="new Date(props.data[props.data.length - 1].created_at)"
        ></Calendar>
      </div>

      <div class="flex flex-column">
        <span>Hasta</span>
        <Calendar
          v-model="to"
          :manualInput="true"
          :minDate="new Date(props.data[0].created_at)"
          :maxDate="new Date(props.data[props.data.length - 1].created_at)"
        ></Calendar>
      </div>
      <div>
        <Button
          @click="updateData"
          label="Filtrar"
          icon="pi pi-filter"
          class="p-button-sm"
        ></Button>
      </div>
    </div>

    <Chart
      type="line"
      :data="chartData"
      :options="chartOptions"
      class="h-30rem"
    ></Chart>
  </div>
</template>
