<script setup>
//TODO:   filtrar los archivos, ordenar los archivos
import { ref, onMounted } from "vue";
import useSupabaseStorage from "@/composables/useSupabaseStorage";
import useCustomToast from "@/composables/utils/useCustomToast";

import { useDateFormat } from "@vueuse/core";

const { getAllFiles, getFileUrl } = useSupabaseStorage();
const { showSuccess, showError } = useCustomToast();

const loading = ref(false);
const files = ref([]);

async function getFiles() {
  loading.value = true;
  files.value.splice(0);
  try {
    files.value = await getAllFiles({
      bucket: "excel_hours",
      folder: "excel_hours",
    });
    if (files.value.length > 0) {
      cleanUpFileList();

      showSuccess("Carga exitosa");
    } else {
      showError("No se encontraron archivos");
    }
  } catch (error) {
    showError(error);
  } finally {
    loading.value = false;
  }
}

function cleanUpFileList() {
  files.value = files.value.filter(
    (file) => !file.name.includes("emptyFolderPlaceholder")
  );
}

function formattedDate(date) {
  return useDateFormat(date, "DD/MM/YYYY HH:mm").value;
}

async function handleDownload(data) {
  const codedFileUrl = await getFileUrl({
    bucket: "excel_hours",
    folder: "excel_hours",
    name: data.name,
  });

  const fileUrl = decodeURIComponent(codedFileUrl);

  if (typeof fileUrl === "string") {
    window.open(fileUrl, "_blank");
  } else {
    console.error("FILE ERROR", fileUrl.error);
    showError("FILE ERROR", "No se pudo cargar el archivo");
  }
}

onMounted(async () => {
  await getFiles();
});
</script>

<template>
  <h1>Lista Documentos Cargados</h1>

  <div class="w-full surface-card py-6 px-3 sm:px-6">
    <div v-if="loading" class="flex align-items-center justify-content-center">
      <i class="pi pi-spin pi-spinner mr-4"></i>
      <span>Cargando...</span>
    </div>
    <div v-else>
      <div
        class="w-full surface-card flex justify-content-end align-items-center mb-4"
      >
        <Button
          :loading="loading"
          label="Volver a cargar la lista"
          @click="getFiles"
        ></Button>
      </div>

      <DataTable
        :value="files"
        responsiveLayout="scroll"
        class="w-full"
        stripedRows
        v-if="files.length > 0"
        :paginator="true"
        :rows="10"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate="Mostrando {first} al {last} de {totalRecords} registros"
        :rowsPerPageOptions="[10, 20, 50]"
        paginatorPosition="bottom"
      >
        <Column field="name" header="Nombre"></Column>
        <Column field="created_at" header="Fecha">
          <template #body="{ data }">
            {{ formattedDate(data.created_at) }}
          </template>
        </Column>
        <Column
          header="Acciones"
          headerStyle="width: 8rem; text-align: center"
          bodyStyle="text-align: center; overflow: visible"
        >
          <template #body="{ data }">
            <Button
              @click="handleDownload(data)"
              class="p-button-rounded"
              icon="pi pi-download"
            ></Button>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
@/composables/utils/useCustomToast
