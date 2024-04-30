<script setup>
import { ref, onMounted } from "vue";

import { useDateFormat } from "@vueuse/core";

import useFudoApi from "@/composables/useFudoApi";
import useGeneric from "@/composables/utils/useGeneric";

import useDateTime from "@/composables/utils/useDateTime";

const { getFudoSaleList } = useFudoApi();
const { formatCurrency } = useGeneric();

const {
  firstDayOfLastMonth,
  firstDayOCurrentMonth,
  lastDayOfLastMonth,
  lastDayOfCurrentMonth,
} = useDateTime();

const loadingSalesList = ref(false);
const salesList = ref([]);

const fromDate = ref("");
const toDate = ref("");

const minFamily = ref(80000);
const percCashback = ref(20);

const dt = ref();

const exportCSV = () => {
  dt.value.exportCSV();
};

async function getData() {
  console.log("getData", fromDate.value, toDate.value);

  if (typeof fromDate.value !== "string") {
    fromDate.value = useDateFormat(fromDate.value, "YYYY/MM/DD").value;
  }

  if (typeof toDate.value !== "string") {
    toDate.value = useDateFormat(toDate.value, "YYYY/MM/DD").value;
  }

  salesList.value.splice(0);

  loadingSalesList.value = true;

  try {
    salesList.value = await getFudoSaleList(
      fromDate.value.split("/").join("-"),
      toDate.value.split("/").join("-")
    );
  } catch (error) {
    console.log(error);
  } finally {
    salesList.value.map(
      (s) =>
        (s.cashback =
          s.totSales >= minFamily.value
            ? (s.totSales * percCashback.value) / 100
            : 0)
    );
    loadingSalesList.value = false;
  }
}
</script>

<template>
  <h1>Estado de la comünidad</h1>

  <div class="w-full grid surface-card py-6 px-3 sm:px-6 my-5">
    <div class="w-full grid">
      <h4 class="col-12">Filtros</h4>

      <div class="col-12 md:col-6 lg:col-3 flex flex-column">
        <span>Desde</span>
        <Calendar :disabled="loadingSalesList" v-model="fromDate" />
      </div>

      <div class="col-12 md:col-6 lg:col-3 flex flex-column">
        <span>Hasta</span>
        <Calendar :disabled="loadingSalesList" v-model="toDate" />
      </div>

      <div class="col-12 flex justify-content-end align-items-center">
        <Button
          :label="
            'Mes pasado' +
            ' (' +
            useDateFormat(firstDayOfLastMonth(), 'MMMM YYYY').value +
            ')'
          "
          :loading="loadingSalesList"
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
          :loading="loadingSalesList"
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
          :loading="loadingSalesList"
          @click="getData"
          label="Filtrar"
          icon="pi pi-filter"
          class="w-auto"
        />
      </div>
    </div>
  </div>

  <div class="w-full grid surface-card py-6 px-3 sm:px-6 my-5">
    <div class="w-full grid">
      <h4 class="col-12">Opciones</h4>

      <div class="col-12 md:col-6 lg:col-3">
        <span>Gasto minimo para ser Family</span>
        <InputNumber
          :disabled="loadingSalesList"
          v-model="minFamily"
          mode="currency"
          :minFractionDigits="2"
          :maxFractionDigits="2"
          locale="es-AR"
          currency="ARS"
          class="w-full"
        />
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <span>Porcentaje de Cashback para los Family</span>
        <InputNumber
          :disabled="loadingSalesList"
          v-model="percCashback"
          :minFractionDigits="2"
          :maxFractionDigits="2"
          suffix="%"
          class="w-full"
        />
      </div>
    </div>
  </div>

  <Message v-if="loadingSalesList" severity="info"
    >La carga de la información puede durar unos minutos. Por favor
    espere.</Message
  >

  <div class="w-full grid surface-card py-6 px-3 sm:px-6">
    <DataTable
      :value="salesList"
      responsiveLayout="scroll"
      class="w-full"
      stripedRows
      :loading="loadingSalesList"
      ref="dt"
      :rows="10"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      :rowsPerPageOptions="[10, 20, 50]"
      paginatorPosition="bottom"
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
      <Column field="name" header="Nombre"></Column>
      <Column field="totSales" header="Total Gastado" sortable>
        <template #body="{ data }">{{
          formatCurrency(data.totSales)
        }}</template>
      </Column>
      <Column field="cashback" header="Cashback ganado">
        <template #body="{ data }">{{
          formatCurrency(data.cashback)
        }}</template>
      </Column>
    </DataTable>
  </div>
</template>
