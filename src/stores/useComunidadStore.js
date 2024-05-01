import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useComunidadStore = defineStore("comunidad", () => {
  const _statusReportData = ref({});

  const statusReportData = computed(() => _statusReportData.value);

  function setStatusReportData(list) {
    _statusReportData.value = list;
  }

  return {
    statusReportData,
    setStatusReportData,
  };
});
