<script setup>
import { ref, onMounted } from "vue";


// COMPOSABLES
import useSupabaseDB from "@/composables/useSupabaseDB";
import useCustomToast from "@/composables/utils/useCustomToast";
import useCustomConfirm from "@/composables/utils/useCustomConfirm";
import { useDateFormat } from "@vueuse/core";
// STORES
import { useAuthStore } from "@/stores/useAuthStore";

// COMPOSABLES VARIABLES
const { getWithFilter, dbResponseStatus, dbResp, create, remove, update } =
  useSupabaseDB();
const { showSuccess, showError } = useCustomToast();
const { showConfirm } = useCustomConfirm();

// COMPONENTS
import BaseInput from "@/components/base/BaseInput.vue";

const props = defineProps({
  table: String,
  filter: Object,
  orderingBy: {
    type: String,
    default: "created_at",
  },
  ascending: {
    type: Boolean,
    default: true,
  },
});

const { profile } = useAuthStore();

const author = profile ? profile.username : null;
const loadingGet = ref(false);
const loadingPost = ref(false);
const notes = ref([]);
const newNote = ref("");

async function getNotes() {
  loadingGet.value = true;

  try {
    await getWithFilter({
      table: props.table,
      filter: props.filter,
      orderingBy: props.orderingBy,
      ascending: props.ascending,
    });

    if (dbResponseStatus.value === "OK") {
      notes.value = dbResp.value;
    } else {
      console.log(dbResp.value);
    }
  } catch (error) {
    showError(error);
  } finally {
    loadingGet.value = false;
  }
}

async function addNote() {
  loadingPost.value = true;
  if (newNote.value) {
    try {
      await create({
        table: props.table,
        data: {
          value: newNote.value,
          profile_id: props.filter.value,
          author
        },
      });
      if (dbResponseStatus.value === "OK") {
        newNote.value = "";
        showSuccess("Nota agregada correctamente");
      } else {
        console.log(dbResp.value);
      } 
    } catch (error) {
      showError(error);
    } finally {
      loadingPost.value = false;
      await getNotes();
    }
  } else {
    showError("Debes agregar una nota");
  }
}

function handleShowConfirm(note){
  showConfirm({
    message: "Eliminar esta nota?",
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
          table: "staff_note",
          id: { key: "staff_note_id", value: note.staff_note_id },
        });
        if (!dbResponseStatus.value === "OK") {
          showError("No se pudo eliminar la nota");
        }
      } catch (error) {
        showError(error);
      } finally {
        await getNotes()
      }
    },
    reject: () => {},
  });
}

onMounted(async () => {
  if(props.filter.value){
    await getNotes();
  } 
});
</script>

<template>

  <div class="w-full flex flex-column p-3">
    <BaseInput label="Nueva nota">
      <Textarea v-model="newNote"></Textarea>
    </BaseInput>
    
    <div class="w-full flex justify-content-end align-items-center mt-2">
      <Button :loading="loadingPost" :disabled="!newNote || loadingPost" label="Guardar nota" icon="pi pi-save" @click="addNote"></Button>
    </div>
  </div>

  <Divider class="w-full mb-3"></Divider>

  <h4>Lista de Notas</h4>

  <div
    v-if="loadingGet"
    class="w-full flex justify-content-center align-items-center"
  >
    <i class="pi pi-spin pi-spinner mr-2"></i>
    <span>Cargando...</span>
  </div>

  <div v-else-if="notes.length == 0" class="w-full flex justify-content-center align-items-center">
    <i class="pi pi-info-circle mr-2"</i>
    <span>No hay notas</span>
  </div>

  <div v-else>
    <div class="w-full flex flex-column p-3">
      <Card v-for="note in notes" :key="note.staff_note_id" class="w-full mb-3">


        <template #content>
          <div class="w-full flex flex-column">
            <span class="text-900 ">{{ note.value }}</span>

            <span class="flex justify-content-end align-items-center mt-4">
              <i class="pi pi-user mr-2"></i>
              <span class="text-600 text-sm font-bold mr-2"> {{ note.author }}</span>
              <span class="text-600 text-sm mr-2">{{ useDateFormat(note.created_at, "DD MMM YYYY - HH:mm").value }}</span>
              <Button :loading="loadingPost" :disabled="loadingPost" icon="pi pi-trash" class="p-button-rounded p-button-secondary p-button-outlined" @click="handleShowConfirm(note)"></Button>
            </span>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>
