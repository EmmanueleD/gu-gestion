import { useToast } from "primevue/usetoast";
export default function useCustomToast() {
  const toast = useToast();

  function showSuccess(summary, detail) {
    toast.add({
      severity: "success",
      summary: summary || "Successo",
      detail: detail || "",
      life: 3000,
    });
  }

  function showError(summary, detail) {
    toast.add({
      severity: "error",
      summary: summary || "Errore",
      detail: detail || "",
      life: 3000,
    });
  }

  return {
    showSuccess,
    showError,
  };
}
