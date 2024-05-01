<script setup>
import { ref, onMounted } from "vue";

import { useDateFormat } from "@vueuse/core";

import useFudoApi from "@/composables/useFudoApi";
import useSupabaseDB from "@/composables/useSupabaseDB";
import useSupaApi from "@/composables/useSupaApi";
import useGeneric from "@/composables/utils/useGeneric";
import useCustomToast from "@/composables/utils/useCustomToast";
import useComunidad from "@/composables/utils/useComunidad";
import useDateTime from "@/composables/utils/useDateTime";

import { useComunidadStore } from "@/stores/useComunidadStore";

const { segmentComunidadByRelations } = useComunidad();
const { showError } = useCustomToast();
const { getComunidadRelaciones } = useSupaApi();
const { getFudoSaleList, getFudoCustomer } = useFudoApi();
const { dbResponseStatus, dbResp, getWithFilter } = useSupabaseDB();
const { formatCurrency } = useGeneric();
const {
  firstDayOfLastMonth,
  firstDayOCurrentMonth,
  lastDayOfLastMonth,
  lastDayOfCurrentMonth,
} = useDateTime();

const comunidadStore = useComunidadStore();

const loadingRelaciones = ref(false);
const relacionesOptions = ref([]);
const relacionesSelected = ref([]);
const loadingCombiningData = ref(false);

const loadingSalesList = ref(false);
const salesList = ref([]);
const customersList = ref([]);

const combinedData = ref([]);

const segmentedData = ref({});

const customersCalled = ref(0);

const fromDate = ref("");
const toDate = ref("");

const minFamily = ref(80000);
const percCashback = ref(20);

const dt = ref();

const exportCSV = () => {
  dt.value.exportCSV();
};

async function getSaleList() {
  if (typeof fromDate.value !== "string") {
    fromDate.value = useDateFormat(fromDate.value, "YYYY/MM/DD").value;
  }

  if (typeof toDate.value !== "string") {
    toDate.value = useDateFormat(toDate.value, "YYYY/MM/DD").value;
  }

  salesList.value.splice(0);

  loadingSalesList.value = true;

  try {
    salesList.value = await getSalesInInterval({
      startDate: fromDate.value.split("/").join("-"),
      endDate: toDate.value.split("/").join("-"),
    });
  } catch (error) {
    console.log(error);
  } finally {
    loadingSalesList.value = false;
  }
}

async function getCommunityReport() {
  try {
    await getSaleList();
    return combineSalesAndCustomers();
  } catch (error) {
    throw error;
  }
}

async function combineSalesAndCustomers() {
  customersCalled.value = 0;
  const currentSalesList = salesList.value;
  const customerMap = {};
  let customerFetchCount = 0;
  loadingCombiningData.value = true;

  try {
    // Loop through the sales list
    for (const sale of currentSalesList) {
      const customerId = sale.relationships.customer.data.id;

      // Check if customer data is already fetched
      if (!customerMap[customerId]) {
        // Fetch customer data
        const customer = await getFudoCustomer(customerId);
        customerFetchCount++;
        customersCalled.value++;

        // Introduce a delay every 10 customer fetches
        if ((customerFetchCount % Math.floor(Math.random() * 5)) + 9 === 0) {
          await delay(1500);
        }

        if (customer) {
          // Initialize customer data if not already present
          customerMap[customerId] = {
            id: customerId,

            name: customer.attributes.name,
            email: customer.attributes.email,

            sales: [],
            totSales: 0,
          };
        }
      }

      // If customer data is available, update sales and totSales
      if (customerMap[customerId]) {
        customerMap[customerId].sales.push(sale);
        customerMap[customerId].totSales += sale.attributes.total;
        if (customerMap[customerId].totSales >= minFamily.value) {
          customerMap[customerId].cashback =
            customerMap[customerId].totSales * (percCashback.value / 100);
        } else {
          customerMap[customerId].cashback = 0;
        }
      }
    }

    // Convert customerMap object to an array of values
    const combinedDataArray = Object.values(customerMap);

    // Set combinedData.value to the refined array
    combinedData.value = combinedDataArray;

    combinedData.value.sort((a, b) => {
      return b.totSales - a.totSales;
    });

    segmentedData.value = segmentComunidadByRelations(
      combinedData.value,
      relacionesOptions.value
    );

    comunidadStore.setStatusReportData(segmentedData.value);
  } catch (error) {
    console.log(error);
  } finally {
    loadingCombiningData.value = false;
  }
}

async function getSalesInInterval(params) {
  const { startDate, endDate } = params;

  let currentSales = [];
  let validCurrentSales = [];
  let salesList = [];
  let page = 1;
  let callCount = 0;
  let reachedValidSales = false;

  do {
    currentSales.splice(0);
    validCurrentSales.splice(0);
    currentSales = await getFudoSaleList(page);

    validCurrentSales = currentSales.filter((sale) => {
      const createdAt = new Date(sale.attributes.createdAt);
      return createdAt <= new Date(endDate);
    });

    if (validCurrentSales.length > 0) {
      reachedValidSales = true;
    }

    if (reachedValidSales) {
      // Filter out sales after the startDate
      validCurrentSales = validCurrentSales.filter((sale) => {
        const createdAt = new Date(sale.attributes.createdAt);
        return createdAt >= new Date(startDate);
      });

      salesList = salesList.concat(validCurrentSales);
    }

    page++;
    callCount++;

    // Check if it's the tenth call, and wait 15 seconds
    if (callCount % 10 === 0) {
      await delay(15000); // Wait for 15 seconds
    }
  } while (!reachedValidSales || validCurrentSales.length > 0);

  return salesList.filter((sale) => sale.relationships.customer.data);
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getRelaciones() {
  loadingRelaciones.value = true;
  relacionesOptions.value.splice(0);
  relacionesSelected.value.splice(0);
  try {
    relacionesOptions.value = await getComunidadRelaciones();
    for (let r of relacionesOptions.value) {
      relacionesSelected.value.push(r.comunidad_relaciones_id);
    }
  } catch (error) {
    showError(error);
  } finally {
    loadingRelaciones.value = false;
  }
}

onMounted(() => {
  getRelaciones();
  if (comunidadStore.statusReportData) {
    segmentedData.value = comunidadStore.statusReportData;
  }
});
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

      <Divider class="col-12"></Divider>

      <div class="col-12 md:col-6 lg:col-3 flex flex-column">
        <span>Relación</span>
        <MultiSelect
          :disabled="loadingRelaciones || loadingSalesList"
          v-model="relacionesSelected"
          :options="relacionesOptions"
          optionLabel="label"
          optionValue="comunidad_relaciones_id"
        />
      </div>

      <Divider class="col-12"></Divider>

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
            getCommunityReport();
          "
        />
        <Button
          :label="
            'Este mes' +
            ' (' +
            useDateFormat(firstDayOCurrentMonth(), 'MMMM YYYY').value +
            ')'
          "
          :loading="loadingSalesList"
          icon="pi pi-arrow-down"
          class="w-auto p-button-secondary mr-2"
          @click="
            fromDate = firstDayOCurrentMonth();
            toDate = lastDayOfCurrentMonth();
            getCommunityReport();
          "
        ></Button>
        <Button
          :disabled="!fromDate || !toDate"
          :loading="loadingSalesList"
          @click="getCommunityReport"
          label="Filtrar"
          icon="pi pi-filter"
          class="w-auto"
        />
      </div>
    </div>
  </div>

  <div v-if="loadingSalesList || loadingCombiningData">
    <Message severity="info"
      >La carga de la información puede durar unos minutos. Para no sobrecargar
      Fudo, se cargará la lista de clientes por bloques de 10.</Message
    >
    <Card class="w-full my-5">
      <template #title> Cargando... </template>
      <template #content>
        <pre v-if="loadingSalesList">
      Cargando lista de ventas...
    </pre
        >
        <pre v-if="loadingCombiningData">
      Asociando ventas a los clientes...
    </pre
        >
        <pre v-if="customersCalled > 0">
      Cargando datos de los clientes... {{ customersCalled }} clientes cargados
    </pre
        >
      </template>
    </Card>
  </div>

  <div class="w-full grid" v-if="!loadingSalesList && combinedData.length > 0">
    <Accordion
      v-for="relation in relacionesOptions.filter((r) =>
        relacionesSelected.includes(r.comunidad_relaciones_id)
      )"
      :key="relation.comunidad_relaciones_id"
      class="w-full my-2"
    >
      <AccordionTab :header="relation.label">
        <DataTable
          v-if="segmentedData[relation.label]"
          :value="segmentedData[relation.label]"
          responsiveLayout="scroll"
          class="w-full"
          stripedRows
          :loading="loadingSalesList"
          ref="dt"
          :rows="10"
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          :rowsPerPageOptions="[10, 20, 50]"
          paginatorPosition="bottom"
          removableSort
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
      </AccordionTab>
    </Accordion>
  </div>
</template>
