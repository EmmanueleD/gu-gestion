import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAppStateStore = defineStore("appState", () => {
  const _appState = ref(false);

  const appState = computed(() => _appState.value);

  function setAppState(state) {
    _appState.value = state;
  }

  return {
    appState,
    setAppState,
  };
});
