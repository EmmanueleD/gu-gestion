import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useStorageStore = defineStore("storage", () => {
  const _currentFile = ref(null);

  const currentFile = computed(() => _currentFile.value);

  function setCurrentFile(file) {
    _currentFile.value = file;
  }

  function resetStore() {
    _currentFile.value = null;
  }

  return {
    currentFile,
    setCurrentFile,
    resetStore,
  };
});
