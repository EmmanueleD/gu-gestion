import { ref } from "vue";
import useSupabaseClient from "./useSupabaseClient";

export default function useSupabaseStorage() {
  const { sbStorage } = useSupabaseClient();

  let newDoc = ref(null);

  async function uploadExcel(
    event,
    fileOptions = {
      bucket: "excel_hours",
      folder: "excel_hours",
    }
  ) {
    newDoc = event.files[0];
    try {
      const { data, error } = await sbStorage
        .from(fileOptions.bucket)
        .upload(fileOptions.folder + "/" + fileOptions.name, newDoc);
      if (error) {
        return error;
      }
      return data;
    } catch (error) {
      return error;
    }
  }

  async function uploadSingleFile(
    event,
    fileOptions = {
      bucket,
      folder,
      fileName,
    }
  ) {
    newDoc.value = event.files[0];
    try {
      const { data, error } = await sbStorage
        .from(fileOptions.bucket)
        .upload(fileOptions.folder + "/" + fileOptions.fileName, newDoc.value);
      if (error) {
        return error;
      }
      return data;
    } catch (error) {
      return error;
    }
  }

  async function getAllFiles(
    from = { bucket: "excel_hours", folder: "excel_hours" },
    options = {
      limit: 1000,
      offset: 0,
      sortBy: {
        column: "name",
        order: "asc",
      },
    }
  ) {
    try {
      const { data, error } = await sbStorage
        .from(from.bucket)
        .list(from.folder, options);
      if (error) {
        return error;
      }
      return data;
    } catch (error) {
      return error;
    }
  }

  async function getFileUrl(fileOptions) {
    try {
      const { data, error } = await sbStorage
        .from(fileOptions.bucket)
        .createSignedUrl(fileOptions.folder + "/" + fileOptions.name, 604800);
      if (error) {
        return error;
      }
      return encodeURIComponent(data.signedUrl);
    } catch (error) {
      return error;
    }
  }

  return {
    uploadSingleFile,
    uploadExcel,
    getAllFiles,
    getFileUrl,
  };
}
