<script setup>
import { ref } from "vue";

import useFudoApi from "@/composables/useFudoApi";
import useCustomToast from "@/composables/utils/useCustomToast";
import useSupabaseDB from "@/composables/useSupabaseDB";

const { getFudoSaleList } = useFudoApi();
const { showError } = useCustomToast();
const { getWithFilter, dbResponseStatus, dbResp } = useSupabaseDB();

const loadingSales = ref(false);
const loadingCustomers = ref(false);

const customerList = ref([]);

const salesList = ref([]);

async function getSalesList() {
  salesList.value.splice(0);
  loadingSales.value = true;
  try {
    const response = await getFudoSaleList(from, to);

    if (response) {
      salesList.value = response;
    } else {
      showError("Error");
    }
  } catch (error) {
    showError(error);
  } finally {
    loadingSales.value = false;
  }
}

async function getCustomersFromSupabase() {
  customerList.value.splice(0);
  loadingCustomers.value = true;

  try {
    await getWithFilter("profiles", {
      column: "gest_role_id",
      value: 6,
    });

    if (dbResponseStatus.value === "OK") {
      customerList.value = dbResp.value;
    } else {
      showError("Error");
    }
  } catch (error) {
    showError(error);
  } finally {
    loadingCustomers.value = false;
  }
}
</script>

<template>
  <h1>Playground</h1>

  <div class="w-full grid">
    <h2 class="col-12">Calculos para la comunidad</h2>

    <div class="col-12 md:col-6 lg:col-4 py-2">
      <Card>
        <template #title> Lista clientes </template>

        <template #content>
          <div class="w-full flex align-items-center justify-content-end">
            <Button
              label="Actualizar"
              icon="pi pi-refresh"
              class="w-auto p-button-secondary mr-2"
              :loading="loadingCustomers"
              @click="getCustomersFromSupabase"
            />
          </div>
          <VirtualScroller
            :items="customerList"
            :itemSize="50"
            class="border-1 surface-border border-round"
            style="width: 200px; height: 400px"
          >
            <template v-slot:item="{ item, options }">
              <div
                :class="[
                  'flex flex-column  p-2',
                  { 'surface-hover': options.odd },
                ]"
                style="height: 45px"
              >
                <span class="font-bold">
                  {{ item.name }}
                </span>
                <span>
                  {{ item.email }}
                </span>
              </div>
            </template>
          </VirtualScroller>
        </template>
      </Card>
    </div>

    <div class="col-12 md:col-6 lg:col-4 py-2">
      <Card>
        <template #title> Lista ventas </template>

        <template #content>
          <div class="w-full flex align-items-center justify-content-end">
            <Button
              label="Actualizar"
              icon="pi pi-refresh"
              class="w-auto p-button-secondary mr-2"
              :loading="loadingSales"
              @click="getSalesList"
            />
          </div>

          <VirtualScroller
            :items="salesList"
            :itemSize="50"
            class="border-1 surface-border border-round"
            style="width: 200px; height: 400px"
          >
            <template v-slot:item="{ item, options }">
              <div
                :class="[
                  'flex flex-column  p-2',
                  { 'surface-hover': options.odd },
                ]"
                style="height: 45px"
              >
                <span class="font-bold">
                  {{
                    Number(item.attributes.total).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })
                  }}
                </span>
                <span>
                  {{ item.date }}
                </span>
              </div>
            </template>
          </VirtualScroller>
        </template>
      </Card>
    </div>
  </div>
</template>
