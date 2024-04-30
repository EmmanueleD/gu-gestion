<script setup>
import { ref, onMounted } from "vue";
import { useDateFormat } from "@vueuse/core";

import useSupabaseClient from "@/composables/useSupabaseClient";
import useGeneric from "@/composables/utils/useGeneric";

const { formatCurrency } = useGeneric();

const { sbDB } = useSupabaseClient();

const dt = ref();

const loadingPaycheckList = ref(false);
const paycheckList = ref([]);

const fromDate = ref("");
const toDate = ref("");

const exportCSV = () => {
  dt.value.exportCSV();
};

function firstDayOfLastMonth() {
  var today = new Date(); // Get today's date
  var lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1); // Create a new date object for the first day of last month
  return (
    lastMonth.getFullYear() +
    "/" +
    (lastMonth.getMonth() + 1 < 10
      ? "0" + (lastMonth.getMonth() + 1)
      : lastMonth.getMonth() + 1) +
    "/01"
  ); // Format the date string
}

function firstDayOCurrentMonth() {
  var today = new Date(); // Get today's date
  var lastMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Create a new date object for the first day of last month
  return (
    lastMonth.getFullYear() +
    "/" +
    (lastMonth.getMonth() + 1 < 10
      ? "0" + (lastMonth.getMonth() + 1)
      : lastMonth.getMonth() + 1) +
    "/01"
  ); // Format the date string
}

function lastDayOfLastMonth() {
  var today = new Date(); // Get today's date
  var lastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Create a new date object for the last day of last month
  return (
    lastMonth.getFullYear() +
    "/" +
    (lastMonth.getMonth() + 1 < 10
      ? "0" + (lastMonth.getMonth() + 1)
      : lastMonth.getMonth() + 1) +
    "/" +
    (lastMonth.getDate() < 10 ? "0" + lastMonth.getDate() : lastMonth.getDate())
  ); // Format the date string
}

function lastDayOfCurrentMonth() {
  var today = new Date(); // Get today's date
  var lastMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Create a new date object for the last day of last month
  return (
    lastMonth.getFullYear() +
    "/" +
    (lastMonth.getMonth() + 1 < 10
      ? "0" + (lastMonth.getMonth() + 1)
      : lastMonth.getMonth() + 1) +
    "/" +
    (lastMonth.getDate() < 10 ? "0" + lastMonth.getDate() : lastMonth.getDate())
  ); // Format the date string
}

async function getData() {
  loadingPaycheckList.value = true;

  let result;

  let start;
  let end;

  if (!fromDate.value) {
    start = firstDayOfLastMonth();
  } else {
    start = new Date(fromDate.value)
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "/");
  }

  if (!toDate.value) {
    end = lastDayOfLastMonth();
  } else {
    end = new Date(toDate.value).toISOString().slice(0, 10).replace(/-/g, "/");
  }

  try {
    result = await sbDB("paycheck")
      .select("*")
      .gt("reference_date", start)
      .lt("reference_date", end);
  } catch (error) {
    console.log(error);
  } finally {
    console.log("RESULT", result);
    paycheckList.value = result.data;
    loadingPaycheckList.value = false;
  }
}

onMounted(async () => {
  await getData();
});
</script>

<template>
  <h1>Sueldos</h1>

  <div class="w-full surface-card py-6 px-3 sm:px-6 my-4">
    <div class="w-full grid">
      <h4 class="col-12">Filtros</h4>

      <div class="col-12 md:col-6 lg:col-3 flex flex-column">
        <span>Desde</span>
        <Calendar v-model="fromDate" />
      </div>

      <div class="col-12 md:col-6 lg:col-3 flex flex-column">
        <span>Hasta</span>
        <Calendar v-model="toDate" />
      </div>

      <div class="col-12 flex justify-content-end align-items-center">
        <Button
          :label="
            'Mes pasado' +
            ' (' +
            useDateFormat(firstDayOfLastMonth(), 'MMMM YYYY').value +
            ')'
          "
          icon="pi pi-arrow-left"
          class="w-auto p-button-secondary mr-2"
          @click="
            fromDate = firstDayOfLastMonth();
            toDate = lastDayOfLastMonth();
            getData();
          "
        />
        <Button
          label="Este mes"
          icon="pi pi-arrow-down"
          class="w-auto p-button-secondary mr-2"
          @click="
            fromDate = firstDayOCurrentMonth();
            toDate = lastDayOfCurrentMonth();
            getData();
          "
        ></Button>
        <Button
          :disabled="!fromDate || !toDate"
          :loading="loadingPaycheckList"
          @click="getData"
          label="Filtrar"
          icon="pi pi-filter"
          class="w-auto"
        />
      </div>
    </div>
  </div>
  <div class="w-full surface-card py-6 px-3 sm:px-6 my-4">
    <DataTable
      :value="paycheckList"
      :loading="loadingPaycheckList"
      responsiveLayout="scroll"
      class="w-full"
      stripedRows
      :paginator="true"
      :rows="10"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      :rowsPerPageOptions="[10, 20, 50]"
      paginatorPosition="bottom"
      ref="dt"
    >
      <template #header>
        <div style="text-align: left">
          <Button
            icon="pi pi-external-link"
            label="Export"
            @click="exportCSV($event)"
          />
        </div>
      </template>
      <Column field="actions" header="Acciones">
        <template #body="{ data }">
          <Button
            class="p-button-outlined mr-2"
            icon="pi pi-eye"
            @click="handleDeleteValue(data)"
          />
        </template>
      </Column>
      <Column field="reference_date" header="Fecha">
        <template #body="{ data }">
          {{ useDateFormat(data.reference_date, "DD/MM/YYYY").value }}
        </template>
      </Column>
      <Column field="profile_name" header="Nombre"></Column>

      <Column field="value.total3" header="Bruto">
        <template #body="{ data }">
          {{ formatCurrency(data.value.bruto) }}
        </template>
      </Column>

      <Column field="value.cuentaCorriente" header="Cuenta Corriente">
        <template #body="{ data }">
          {{ formatCurrency(data.value.cuentaCorriente) }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>
