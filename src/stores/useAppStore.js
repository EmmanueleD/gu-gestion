import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAppStore = defineStore("appState", () => {
  const _currentEmployee = ref(null);

  const currentEmployee = computed(() => _currentEmployee.value);

  function setCurrentEmployee(employee) {
    _currentEmployee.value = employee;
  }

  return {
    currentEmployee,
    setCurrentEmployee,
  };
});
