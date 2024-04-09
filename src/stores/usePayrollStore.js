import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const usePayrollStore = defineStore("payroll-state", () => {
  const _adelantos = ref([]);

  const adelantos = computed(() => _adelantos.value);

  function setAdelantos(adelantos) {
    _adelantos.value = adelantos;
  }

  return {
    adelantos,
    setAdelantos,
  };
});
