<script setup>
import { ref } from "vue";

// COMPOSABLES
import useSupabaseDB from "@/composables/useSupabaseDB";
import useCustomToast from "@/composables/utils/useCustomToast";
import { useDateFormat } from "@vueuse/core";
import useGeneric from "@/composables/utils/useGeneric";
import useCustomConfirm from "@/composables/utils/useCustomConfirm";
import useSupaApi from "@/composables/useSupaApi";

// COMPONENTS
import SingleLineChart from "@/components/custom/SingleLineChart.vue";
import SingleBarChart from "@/components/custom/SingleBarChart.vue";

// CONSTANTS
import GRAPH_TYPES from "@/constants/GRAPH_TYPES.json";

// COMPOSABLES VARIABLES
const { dbResponseStatus, dbResp, getAll, create, remove } = useSupabaseDB();
const { showSuccess, showError } = useCustomToast();
const { formatCurrency } = useGeneric();
const { showConfirm } = useCustomConfirm();
const { deleteStaffAntiguedad } = useSupaApi();

// COMPONENT VARIABLES
const historicSeries = ref([]);
const currentSeniorityModifierValue = ref(0);
const loading = ref(false);
const loadingNewValue = ref(false);
const newValueVisible = ref(false);
const newValue = ref(0);
const newValueDate = ref(new Date());
const newValueNote = ref("");
const chartTypeOptions = GRAPH_TYPES;
const chartTypeSelected = ref(chartTypeOptions[0].value);
const dt = ref();

async function getData() {
  loading.value = true;
  try {
    await getAll({ table: "mod_staff_antiguedad", orderingBy: "created_at" });
    if (dbResponseStatus.value === "OK") {
      historicSeries.value = dbResp.value;
      currentSeniorityModifierValue.value =
        dbResp.value[0].value.toLocaleString("es-AR", {
          style: "percent",
          minimumFractionDigits: 2,
        });

      showSuccess("Carga exitosa");
    } else {
      currentSeniorityModifierValue.value = 0;
      historicSeries.value = [];
      showError("No se encontraron archivos");
    }
  } catch (error) {
    showError(error);
  } finally {
    loading.value = false;
  }
}

function handleNewValue() {
  newValue.value = 0;
  newValueNote.value = "";
  newValueDate.value = new Date();
  newValueVisible.value = true;
}

function hideNewValue() {
  newValue.value = 0;
  newValueDate.value = new Date();
  newValueVisible.value = false;
}

async function saveNewValue() {
  loadingNewValue.value = true;
  try {
    await create({
      table: "seniority_modifier",
      data: {
        value: newValue.value,
        note: newValueNote.value,
        created_at: newValueDate.value,
      },
    });

    if (dbResponseStatus.value === "OK") {
      showSuccess("Creado exitosamente");
    } else {
      showError("No se encontraron archivos");
    }
  } catch (error) {
    showError(error);
  } finally {
    loadingNewValue.value = false;
    await getData();
    hideNewValue();
  }
}

async function handleDeleteValue(data) {
  showConfirm({
    message: "¿Desea eliminar este valor?",
    header: "Confirmar",
    icon: "pi pi-info-circle",
    acceptLabel: "Si",
    rejectLabel: "No",
    acceptClassName: "p-button-danger",
    acceptIcon: "pi pi-trash",
    rejectIcon: "pi pi-times",
    rejectClassName: "p-button-secondary",

    accept: async () => {
      try {
        await deleteStaffAntiguedad(data);
      } catch (error) {
        showError(error);
      } finally {
        await getData();
      }
    },
    reject: () => {},
  });
}

function exportCSV() {
  dt.value.exportCSV();
}

getData();
</script>

<template>
  <h1>Antiguedad</h1>

  <div class="w-full surface-card py-6 px-3 sm:px-6 grid">
    <div class="col-12 flex align-items-center justify-content-center px-0">
      <div
        v-if="loading"
        class="flex align-items-center justify-content-center"
      >
        <i class="pi pi-spin pi-spinner mr-4" style="font-size: 3rem"></i>
        <span>Cargando...</span>
      </div>
      <div
        v-else
        class="w-full flex align-items-center justify-content-between"
      >
        <Card>
          <template #title> Valor Actual </template>

          <template #content>
            <div class="w-full flex flex-column align-items-center gap-3">
              <div
                class="w-full flex justify-content-start align-items-center gap-1"
              >
                <span
                  v-if="currentSeniorityModifierValue"
                  class="font-bold text-3xl"
                  >{{ currentSeniorityModifierValue }}</span
                >
              </div>
            </div>
          </template>
        </Card>

        <Button
          @click="getData"
          label="Actualizar"
          icon="pi pi-sync"
          class="w-auto p-button-secondary"
        />
      </div>
    </div>

    <Divider class="w-full my-4"></Divider>

    <div class="w-full grid">
      <div
        class="col-12 md:col-6 flex flex-column align-items-center justify-content-start"
      >
        <div v-if="loading">
          <Skeleton></Skeleton>
        </div>
        <div v-else class="w-full surface-card my-4">
          <div
            class="w-full flex justify-content-start align-items-center mb-4 gap-3"
          >
            <h2 class="m-0 pb-1">Grafico</h2>

            <Dropdown
              v-model="chartTypeSelected"
              :options="chartTypeOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Tipo de grafico"
            ></Dropdown>
          </div>

          <SingleLineChart
            v-if="chartTypeSelected === 'line'"
            title="Historico valor presentismo"
            :data="historicSeries"
          ></SingleLineChart>
          <SingleBarChart
            v-if="chartTypeSelected === 'bar'"
            title="Historico valor presentismo"
            :data="historicSeries"
          ></SingleBarChart>
        </div>
      </div>
      <div
        class="col-12 md:col-6 flex flex-column align-items-center justify-content-start"
      >
        <div class="w-full surface-card my-4">
          <div
            class="w-full flex justify-content-between align-items-center mb-3"
          >
            <h2 class="m-0 pb-1">Tabla</h2>
            <Button
              @click="handleNewValue"
              label="Crear un nuevo valor"
              icon="pi pi-plus"
              class="w-auto p-button-primary"
            ></Button>
          </div>
          <DataTable
            :value="historicSeries"
            :loading="loading"
            :paginator="true"
            :rows="10"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            :rowsPerPageOptions="[10, 20, 50]"
            responsiveLayout="scroll"
            stripedRows
            v-if="historicSeries.length > 0"
            class="w-full"
            ref="dt"
            sortField="created_at"
            :sortOrder="-1"
          >
            <template #header>
              <div
                class="w-full flex justify-content-end align-items-center p-0 m-0"
              >
                <Button
                  icon="pi pi-external-link"
                  label="Exportar a CSV"
                  class="p-button-secondary p-button-outlined p-button-sm"
                  @click="exportCSV($event)"
                />
              </div>
            </template>
            <Column field="created_at" header="Fecha" sortable>
              <template #body="{ data }">
                {{
                  useDateFormat(data.created_at, "DD MMMM YYYY ", {
                    locales: "es-AR",
                  }).value
                }}
              </template>
            </Column>
            <Column field="value" header="Valor" sortable>
              <template #body="{ data }">
                {{
                  data.value.toLocaleString("es-AR", {
                    style: "percent",
                    minimumFractionDigits: 2,
                  })
                }}
              </template>
            </Column>
            <Column field="note" header="Notas"></Column>
            <Column field="actions" header="Acciones">
              <template #body="{ data }">
                <Button
                  class="p-button-outlined p-button-danger mr-2"
                  icon="pi pi-trash"
                  @click="handleDeleteValue(data)"
                ></Button>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
  <Sidebar
    v-model:visible="newValueVisible"
    position="right"
    class="w-full md:w-7 lg:w-4"
    @hide="hideNewValue"
  >
    <h2>Nuevo Valor</h2>

    <div class="w-full surface-card my-4 p-3 grid">
      <div class="col-12 md:col-6 flex flex-column">
        <span>Valor</span>
        <InputNumber
          v-model="newValue"
          mode="decimal"
          :minFractionDigits="2"
          :maxFractionDigits="2"
          class="w-full"
          :disabled="loadingNewValue"
        />
      </div>

      <div class="col-12 md:col-6 flex flex-column">
        <span>Fecha</span>
        <Calendar
          v-model="newValueDate"
          class="w-full"
          :disabled="loadingNewValue"
        />
      </div>

      <div class="col-12 flex flex-column">
        <span>Notas</span>
        <Textarea
          v-model="newValueNote"
          class="w-full"
          :disabled="loadingNewValue"
        />
      </div>

      <div class="col-12 flex justify-content-start align-items-center mt-4">
        <Button
          @click="saveNewValue"
          label="Guardar"
          icon="pi pi-save"
          class="w-auto"
          :loading="loadingNewValue"
          :disabled="loadingNewValue"
        />
      </div>
    </div>
  </Sidebar>
</template>
