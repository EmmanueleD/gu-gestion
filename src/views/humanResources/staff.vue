<script setup>
import { ref, onMounted } from "vue";

// COMPOSABLES
import useSupabaseDB from "@/composables/useSupabaseDB";
import useGeneric from "@/composables/utils/useGeneric";
import useCustomToast from "@/composables/utils/useCustomToast";

// COMPOSABLES VARIABLES
const { getAll, dbResponseStatus, dbResp } = useSupabaseDB();
const { percToNumber, numberToPerc } = useGeneric();
const { showSuccess } = useCustomToast();

// STORES
import { useAppStore } from "@/stores/useAppStore";

const appStore = useAppStore();

// COMPONENT VARIABLES
const employees = ref([]);
const employees_roles = ref([]);
const loadingEmployees = ref(false);
const loadingEmployeesRoles = ref(false);
const sidebarVisible = ref(false);

// METHODS
function employeeRoles(employee_id) {
  const roles = [];
  employees_roles.value.forEach((employee_role) => {
    if (employee_role.employee_id === employee_id) {
      roles.push(employee_role.role_id);
    }
  });
  return roles;
}

function showSidebar(employee) {
  appStore.setCurrentEmployee(employee);
  sidebarVisible.value = true;
}

async function getEmployees() {
  loadingEmployees.value = true;

  try {
    await getAll({ table: "employee" });

    if (dbResponseStatus.value === "OK") {
      employees.value = dbResp.value;
      showSuccess("Carga exitosa");
    } else {
      showError("No se encontraron Staff");
    }
  } catch (error) {
    showError(error);
  } finally {
    loadingEmployees.value = false;
  }
}

async function getEmployeesRoles() {
  loadingEmployeesRoles.value = true;
  try {
    await getAll({ table: "employee_role" });
    if (dbResponseStatus.value === "OK") {
      employees_roles.value = dbResp.value;

      showSuccess("Carga exitosa");
    } else {
      showError("No se encontraron roles");
    }
  } catch (error) {
    showError(error);
  } finally {
    loadingEmployeesRoles.value = false;
  }
}

async function getData() {
  await getEmployees();
  await getEmployeesRoles();
}

onMounted(async () => {
  await getData();
});
</script>

<template>
  <div class="w-full flex justify-content-between align-items-center">
    <h1>Staff</h1>
    <div class="flex justify-content-end align-items-center">
      <Button
        label="Actualizar"
        icon="pi pi-refresh"
        class="w-auto p-button-secondary mr-2"
        :disabled="loadingEmployees"
        @click="getData"
      />
      <Button
        label="Nuevo Empleado"
        icon="pi pi-plus"
        class="w-auto"
        :disabled="loadingEmployees"
        @click="showSidebar({})"
      />
    </div>
  </div>

  <div class="w-full surface-card py-6 px-3 sm:px-6">
    <DataTable
      :value="employees"
      :loading="loadingEmployees || loadingEmployeesRoles"
      responsiveLayout="scroll"
      class="w-full"
      stripedRows
      v-if="employees.length > 0"
      :paginator="true"
      :rows="10"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate="Mostrando {first} al {last} de {totalRecords} registros"
      :rowsPerPageOptions="[10, 20, 50]"
      paginatorPosition="bottom"
    >
      <Column field="full_name" header="Nombre Completo"></Column>
      <Column field="role_id" header="Rol">
        <template #body="{ data }">
          {{
            employees_roles
              .find((role) => role.id === data.role_id)
              ?.label.replace(" ", "")
          }}
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
    <h1>{{ appStore.currentEmployee?.full_name || "Crear staff" }}</h1>

    <TabView class="w-full">
      <TabPanel header="Información">
        <div class="w-full grid">
          <div class="col-12 md:col-6 lg:col-3 mb-2 flex flex-column">
            <span>Numbre completo</span>
            <InputText
              v-model="appStore.currentEmployee.full_name"
              class="w-full"
            />
          </div>

          <div class="col-12 md:col-6 lg:col-3 mb-2 flex flex-column">
            <span>Dirección</span>
            <InputText
              v-model="appStore.currentEmployee.address"
              class="w-full"
            />
          </div>
        </div>
      </TabPanel>
      <TabPanel header="Documentos"></TabPanel>
      <TabPanel header="Notas"></TabPanel>
      <TabPanel header="Historial"></TabPanel>
    </TabView>
  </Sidebar>
</template>
