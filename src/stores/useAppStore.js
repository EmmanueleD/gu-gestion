import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAppStore = defineStore("app-state", () => {
  const _currentEmployee = ref(null);
  const _freeFingerId = ref(null);

  const currentEmployee = computed(() => _currentEmployee.value);
  const freeFingerId = computed(() => _freeFingerId.value);

  function setCurrentEmployee(employee) {
    _currentEmployee.value = employee;
  }

  function setFreeFingerId(fingerId) {
    _freeFingerId.value = fingerId;
  }

  return {
    currentEmployee,
    freeFingerId,
    setCurrentEmployee,
    setFreeFingerId,
  };
});
