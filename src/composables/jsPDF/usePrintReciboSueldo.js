import { ref } from "vue";
import { useRRHHStore } from "@/stores/useRRHHStore";
import { jsPDF } from "jspdf";

export default function usePrintReciboSueldo() {
  const RRHH_STORE = useRRHHStore();
  function print() {
    const doc = new jsPDF();
    doc.text("Hello world!", 10, 10);

    doc.save("a4.pdf");
  }

  return {
    print,
  };
}
