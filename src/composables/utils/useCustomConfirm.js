import { useConfirm } from "primevue/useconfirm";
export default function useCustomConfirm() {
  const confirm = useConfirm();

  function showConfirm(options) {
    confirm.require({
      ...options,
      accept: () => {
        options.accept();
        confirm.close();
      },
      reject: () => {
        options.reject();
        confirm.close();
      },
    });
  }

  return {
    showConfirm,
  };
}
