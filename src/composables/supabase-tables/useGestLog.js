import { computed } from "vue";

import useSupabaseDB from "../useSupabaseDB";

import { useAuthStore } from "@/stores/useAuthStore";

const { dbResp, get, getAll, create, update, remove } = useSupabaseDB();
const authStore = useAuthStore();

export default function useGestLog() {
  const profile = computed(() => authStore.profile);

  async function createLog(note) {
    if (!note) return "Note is required";
    if (!profile) return "Profile is required";

    try {
      const { data, error } = await create({
        table: "gest_log",
        data: {
          profile_id: profile.value.id,
          note,
        },
      });
      if (error) return error;
      return data;
    } catch (error) {
      return error;
    }
  }

  return {
    createLog,
  };
}
