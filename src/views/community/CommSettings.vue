<script setup>
import { ref, onMounted } from "vue";

import { useConfirm } from "primevue/useconfirm";

import useSupaApi from "@/composables/useSupaApi";
import useCustomToast from "@/composables/utils/useCustomToast";
import useGeneric from "@/composables/utils/useGeneric";

import BaseInput from "@/components/base/BaseInput.vue";

const confirm = useConfirm();

const {
  getComunidadRelaciones,
  saveComunidadRelaciones,
  deleteComunidadRelaciones,
} = useSupaApi();
const { showError } = useCustomToast();
const { formatCurrency } = useGeneric();

const loadingRelaciones = ref(false);
const relaciones = ref([]);

const sidebarVisible = ref(false);
const currentRelacion = ref({});

function showSidebar(relacion) {
  sidebarVisible.value = true;
  currentRelacion.value = relacion;
}

async function getRelaciones() {
  loadingRelaciones.value = true;
  try {
    relaciones.value = await getComunidadRelaciones();
  } catch (error) {
    showError(error);
  } finally {
    loadingRelaciones.value = false;
  }
}

async function handleSaveRelacion() {
  loadingRelaciones.value = true;
  try {
    await saveComunidadRelaciones(currentRelacion.value);
  } catch (error) {
    showError(error);
  } finally {
    handleHideSidebar();
    getRelaciones();
    loadingRelaciones.value = false;
  }
}

async function handleDeleteRelacion(relacion) {
  confirm.require({
    target: event.currentTarget,
    message: `¿Deseas borrar la relación "${relacion.label}" ?`,
    icon: "pi pi-exclamation-triangle",
    accept: async () => {
      loadingRelaciones.value = true;
      try {
        await deleteComunidadRelaciones(relacion.comunidad_relaciones_id);
      } catch (error) {
        showError(error);
      } finally {
        loadingRelaciones.value = false;
        handleHideSidebar();
        getRelaciones();
      }
    },
  });
}

function handleHideSidebar() {
  sidebarVisible.value = false;
  currentRelacion.value = {};
}

onMounted(getRelaciones);
</script>

<template>
  <h1>Configuración de la comünidad</h1>

  <div class="w-full grid">
    <div class="col-12 my-5 px-3 py-6">
      <div class="grid surface-card py-6 px-3 sm:px-6">
        <div class="col-12 flex justify-content-between align-items-center">
          <h2>Relaciones</h2>
          <div class="flex justify-content-end align-items-center">
            <Button
              label="Actualizar"
              icon="pi pi-sync"
              class="w-auto p-button-secondary mr-2"
              :disabled="loadingRelaciones"
              @click="getRelaciones"
            />
            <Button
              label="Nueva"
              icon="pi pi-plus"
              class="w-auto"
              :disabled="loadingRelaciones"
              @click="showSidebar({})"
            />
          </div>
        </div>

        <div class="col-12">
          <DataTable
            :value="relaciones"
            responsiveLayout="scroll"
            class="w-full"
            stripedRows
            :loading="loadingRelaciones"
            v-if="relaciones.length > 0"
            removableSort
            sortMode="multiple"
          >
            <Column field="actions" header="Acciones">
              <template #body="{ data }">
                <Button
                  class="p-button-outlined p-button-danger mr-2"
                  icon="pi pi-trash"
                  @click="handleDeleteRelacion(data)"
                ></Button>

                <Button
                  class="p-button-outlined p-button-secondary"
                  icon="pi pi-pencil"
                  @click="showSidebar(data)"
                ></Button>
              </template>
            </Column>

            <Column field="label" header="Nombre" sortable></Column>
            <Column field="details" header="Descripción"></Column>
            <Column field="min" header="Mínimo" sortable>
              <template #body="{ data }">
                <span>{{ formatCurrency(data.min) }}</span>
              </template>
            </Column>
            <Column field="max" header="Máximo" sortable>
              <template #body="{ data }">
                <span v-if="!data.max">-</span>
                <span v-else>{{ formatCurrency(data.max) }}</span>
              </template>
            </Column>
            <Column field="cashback" header="Cashback" sortable>
              <template #body="{ data }">
                <i v-if="!data.cashback" class="pi pi-times text-gray-500"></i>
                <span v-else class="text-green-500">
                  {{ data.cashback }} %
                </span>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>
  </div>

  <Sidebar
    v-model:visible="sidebarVisible"
    :baseZIndex="10000"
    position="right"
    class="w-full md:w-9 lg:w-5"
    @hide="handleHideSidebar"
  >
    <h1>Detalles de la relación</h1>

    <div class="w-full grid">
      <BaseInput label="Nombre" class="col-12 md:col-6 mb-2">
        <InputText v-model="currentRelacion.label" />
      </BaseInput>

      <div class="col-12"></div>

      <BaseInput label="Descripción" class="col-12 md:col-6 mb-2">
        <InputText v-model="currentRelacion.details" />
      </BaseInput>

      <div class="col-12"></div>

      <BaseInput label="Mínimo" class="col-12 md:col-4 mb-2">
        <InputNumber
          v-model="currentRelacion.min"
          mode="currency"
          currency="ARS"
          locale="es-AR"
          :min-fraction-digits="2"
          :max-fraction-digits="2"
        />
      </BaseInput>

      <BaseInput label="Máximo" class="col-12 md:col-4 mb-2">
        <InputNumber
          v-model="currentRelacion.max"
          mode="currency"
          currency="ARS"
          locale="es-AR"
          :min-fraction-digits="2"
          :max-fraction-digits="2"
        />
      </BaseInput>

      <BaseInput label="Cashback" class="col-12 md:col-4 mb-2">
        <InputNumber
          v-model="currentRelacion.cashback"
          suffix="%"
          :min-fraction-digits="2"
          :max-fraction-digits="2"
        />
      </BaseInput>

      <div class="col-12 flex justify-content-end align-items-center">
        <Button
          label="Guardar"
          icon="pi pi-save"
          class="w-auto"
          :loading="loadingRelaciones"
          @click="handleSaveRelacion"
        />
      </div>
    </div>
  </Sidebar>
</template>
