import { useToast } from "primevue/usetoast";
export default function useCustomToast() {
  const toast = useToast();

  function showSuccess(summary = "OK", detail = "", life = 3000) {
    toast.add({
      severity: "success",
      summary,
      detail,
      life,
    });
  }

  function showError(summary = "ERROR", detail = "", life = 3000) {
    toast.add({
      severity: "error",
      summary,
      detail,
      life,
    });
  }

  function showInfo(summary = "INFO", detail = "", life = 3000) {
    toast.add({
      severity: "info",
      summary,
      detail,
      life,
    });
  }

  return {
    showSuccess,
    showError,
    showInfo,
  };
}
