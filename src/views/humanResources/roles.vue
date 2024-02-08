<script setup>
import { ref, onMounted } from "vue";

// COMPOSABLES
import useSupabaseDB from "@/composables/useSupabaseDB";
import useGeneric from "@/composables/utils/useGeneric";
import useCustomToast from "@/composables/utils/useCustomToast";
import useCustomConfirm from "@/composables/utils/useCustomConfirm";

// COMPOSABLES VARIABLES
const { getAll, dbResponseStatus, dbResp, create, remove, update } =
  useSupabaseDB();
const { percToNumber, numberToPerc } = useGeneric();
const { showSuccess, showError } = useCustomToast();
const { showConfirm } = useCustomConfirm();

// COMPONENT VARIABLES
const roles = ref([]);
const loading = ref(false);
const sidebarVisible = ref(false);
const currentRole = ref({});

function hideSidebar() {
  sidebarVisible.value = false;
  currentRole.value = {};
}

function showSidebar(role) {
  sidebarVisible.value = true;
  currentRole.value = role;
}

// FUNCTIONS
async function getData() {
  loading.value = true;
  try {
    await getAll({ table: "role_w_modifier", orderingBy: "role_id" });
    if (dbResponseStatus.value === "OK") {
      roles.value = dbResp.value.map((role) => {
        return {
          ...role,
          role_modifier_value: numberToPerc(role.role_modifier_value),
        };
      });
      showSuccess("Carga exitosa");
    } else {
      roles.value = [];
      showError("No se encontraron roles");
    }
  } catch (error) {
    showError(error);
  } finally {
    loading.value = false;
  }
}

async function saveRole() {
  loading.value = true;
  try {
    if (currentRole.value.role_id) {
      await update({
        table: "role",
        id: { key: "role_id", value: currentRole.value.role_id },
        data: {
          label: currentRole.value.label,
          description: currentRole.value.description,
          created_at: currentRole.value.role_created_at,
          updated_at: new Date(),
        },
      });
    } else {
      await create({
        table: "role",
        data: {
          label: currentRole.value.label,
          description: currentRole.value.description,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
      console.log("despues de crear", dbResp.value);
      currentRole.value.role_id = dbResp.value[0].role_id;
    }
    if (dbResponseStatus.value === "OK") {
      showSuccess("Guardado exitoso");
    } else {
      showError("No se pudo guardar el rol");
    }
  } catch (error) {
    showError(error);
  } finally {
    loading.value = false;
  }
}

async function saveRoleModifier() {
  if (!currentRole.value.role_id) return;
  console.log("currentRole", currentRole.value);
  loading.value = true;
  try {
    await create({
      table: "role_modifier",
      data: {
        role_id: currentRole.value.role_id,
        value: percToNumber(currentRole.value.role_modifier_value),
        created_at: new Date(),
      },
    });
    if (dbResponseStatus.value === "OK") {
      showSuccess("Guardado exitoso");
    } else {
      showError("No se pudo guardar el valor del rol");
    }
  } catch (error) {
    showError(error);
  } finally {
    loading.value = false;
  }
}

async function handleSave() {
  loading.value = true;
  try {
    await saveRole();
    await saveRoleModifier();
  } catch (error) {
    showError(error);
  } finally {
    loading.value = false;
    await getData();
    hideSidebar();
  }
}

async function handleRemove(data) {
  showConfirm({
    message: "¿Desea eliminar este rol?",
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
        await remove({
          table: "role",
          id: { key: "role_id", value: data.role_id },
        });
        if (dbResponseStatus.value === "OK") {
          showSuccess("Eliminado exitoso");
        } else {
          showError("No se pudo eliminar el rol");
        }
      } catch (error) {
        showError(error);
      } finally {
        await getData();
      }
    },
    reject: () => {},
  });
}

onMounted(async () => {
  await getData();
});
</script>

<template>
  <div class="w full flex justify-content-between align-items-center">
    <h1>Roles</h1>
    <div class="flex justify-content-end align-items-center">
      <Button
        label="Actualizar"
        icon="pi pi-refresh"
        class="w-auto p-button-secondary mr-2"
        :disabled="loading"
        @click="getData"
      />
      <Button
        label="Nuevo Rol"
        icon="pi pi-plus"
        class="w-auto"
        :disabled="loading"
        @click="showSidebar({})"
      />
    </div>
  </div>

  <div class="w-full surface-card py-6 px-3 sm:px-6">
    <DataTable
      :value="roles"
      :loading="loading"
      responsiveLayout="scroll"
      class="w-full"
      stripedRows
      v-if="roles.length > 0"
      :paginator="true"
      :rows="10"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate="Mostrando {first} al {last} de {totalRecords} registros"
      :rowsPerPageOptions="[10, 20, 50]"
      paginatorPosition="bottom"
    >
      <Column field="label" header="Rol"></Column>
      <Column field="description" header="Descripción"></Column>
      <Column field="role_modifier_value" header="Valor">
        <template #body="{ data }"> {{ data.role_modifier_value }} % </template>
      </Column>
      <Column header="Acciones">
        <template #body="{ data }">
          <Button
            class="p-button-outlined p-button-danger mr-2"
            icon="pi pi-trash"
            @click="handleRemove(data)"
          />
          <Button
            class="p-button-outlined p-button-secondary"
            icon="pi pi-pencil"
            @click="showSidebar(data)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
  <Sidebar
    v-model:visible="sidebarVisible"
    :baseZIndex="10000"
    position="right"
    class="w-full md:w-9 lg:w-5"
    @hide="hideSidebar"
  >
    <h2 class="mb-4">
      {{ currentRole.role_id ? currentRole.label : "Nuevo Rol" }}
    </h2>

    <div class="w-full grid">
      <div class="col-12 md:col-6 flex flex-column mb-2">
        <span>Nombre</span>
        <InputText
          v-model="currentRole.label"
          class="w-full"
          :disabled="loading"
        />
      </div>
      <div class="col-12 flex flex-column mb-2">
        <span>Descripción</span>
        <Textarea
          v-model="currentRole.description"
          class="w-full"
          :disabled="loading"
        />
      </div>

      <div class="col-12 md:col-6 flex flex-column mb-2">
        <span>Valor</span>
        <InputNumber
          v-model="currentRole.role_modifier_value"
          mode="decimal"
          :minFractionDigits="2"
          :maxFractionDigits="2"
          suffix="%"
          class="w-full"
          :disabled="loading"
        />
      </div>

      <div class="col-12 flex justify-content-start align-items-center my-4">
        <Button label="Guardar" icon="pi pi-save" @click="handleSave" />
      </div>
    </div>
  </Sidebar>
</template>
