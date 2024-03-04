import { ref } from "vue";
import useSupabaseAuth from "./useSupabaseAuth";
import useSupabaseDB from "./useSupabaseDB";
import useFudoApi from "./useFudoApi";
import { useAuthStore } from "@/stores/useAuthStore";
import { useFudoStore } from "@/stores/useFudoStore";

export default function useAuth() {
  const { supaSignOut, supaSignIn, supaSignUp, supaAuthResp } =
    useSupabaseAuth();
  const { dbResponseStatus, dbResp, get, create, update } = useSupabaseDB();
  const { getCustomerByAttribute, fetchData } = useFudoApi();
  const authStore = useAuthStore();
  const fudoStore = useFudoStore();

  const guAuthResponse = ref({ data: null, error: null, event: null });
  const supaProfile = ref(null);
  const fudoProfile = ref(null);

  async function guLogin({ email, password }) {
    resetGuAuthResponse();
    try {
      await signInWithEmailAndPassword({ email, password });
      setupGuAuthResponse();
      await fetchProfiles();
      setupAuthStore();
    } catch (error) {
      handleLoginError(error);
    } finally {
      setupFudoStore();
    }
  }

  async function guRegister({ email, password, name }) {
    resetGuAuthResponse();
    try {
      await supaSignUp({ email, password, name });
      setupGuAuthResponse();
    } catch (error) {
      handleLoginError(error);
    }
  }

  async function guLogout() {
    resetGuAuthResponse();
    await supaSignOut();
    resetAuthStore();
    resetFudoStore();
  }

  async function signInWithEmailAndPassword({ email, password }) {
    await supaSignIn({ email, password });
  }

  async function fetchProfiles() {
    const supaId = guAuthResponse.value.data.user.id;
    supaProfile.value = await getSupaProfile({ supaId });

    if (supaProfile.value) {
      await fetchFudoProfile();
    } else {
      handleProfileNotFound("supabase");
    }
  }

  async function getSupaProfile({ supaId }) {
    try {
      await get({ table: "profiles", id: { key: "id", value: supaId } });
      if (dbResponseStatus.value === "OK") {
        return dbResp.value;
      }
      throw new Error(dbResponseStatus.value);
    } catch (error) {
      handleLoginError(error);
    }
  }

  async function fetchFudoProfile() {
    const profile = supaProfile.value;

    if (profile.fudo_id) {
      const resp = await fetchData(`customers/${profile.fudo_id}`, "GET");
      fudoProfile.value = resp.data;

      await updateSupaProfile({
        fudo_id: fudoProfile.value.id,
        ...fudoProfile.value.attributes,
        gu_level_id: countStars(fudoProfile.value.attributes.name),
      });
    } else if (profile.email) {
      const resp = await getCustomerByAttribute({
        key: "email",
        value: profile.email,
      });

      if (resp.length > 0) {
        await updateSupaProfile({
          fudo_id: resp[0].id,
          ...resp[0].attributes,
          gu_level_id: countStars(resp[0].attributes.name),
        });

        await fetchFudoProfile();
      } else {
        const newFudoProfile = await fetchData("customers", "POST", {
          data: {
            type: "Customer",
            attributes: {
              active: true,
              address: ["", "", "", ""],
              comment: "[from gu-gestion]",
              // discountPercentage: 0,
              houseAccountEnabled: false,
              name: profile.name,
              email: profile.email,
              // phone: "",
              // vatNumber: "",
            },
          },
        });

        // await updateSupaProfileField({
        //   fudo_id: newFudoProfile.data.id,
        //   ...newFudoProfile.data.attributes,
        //   gu_level_id: countStars(newFudoProfile.data.attributes.name),
        // });
        await updateSupaProfile({
          fudo_id: newFudoProfile.data.id,
          ...newFudoProfile.data.attributes,
          gu_level_id: countStars(newFudoProfile.data.attributes.name),
        });
        await fetchFudoProfile();
      }
    }

    if (!fudoProfile.value) {
      handleProfileNotFound("fudo");
    }
  }

  function countStars(str) {
    const starCount = (str.match(/⭐/g) || []).length;
    if (starCount === 1) {
      return 1;
    } else if (starCount === 2) {
      return 2;
    } else if (starCount >= 3) {
      return 3;
    } else {
      return 0; // Return 0 if no stars are found
    }
  }

  async function updateSupaProfile(data) {
    for (const [key, value] of Object.entries(data)) {
      await updateSupaProfileField(key, value);
    }
  }

  async function updateSupaProfileField(column, value) {
    try {
      await update({
        table: "profiles",
        id: { key: "id", value: supaProfile.value.id },
        data: { [column]: value },
      });
      if (dbResponseStatus.value === "OK") {
        supaProfile.value = await getSupaProfile({
          supaId: supaProfile.value.id,
        });
      } else {
        throw new Error(dbResponseStatus.value);
      }
    } catch (error) {
      handleLoginError(error);
    }
  }

  function handleProfileNotFound(profileType) {
    resetAuthStore();
    resetFudoStore();
    throw new Error(`${profileType} profile not found`);
  }

  function handleLoginError(error) {
    resetAuthStore();
    throw new Error(error.message || error || "AUTH ERROR");
  }

  function resetGuAuthResponse() {
    guAuthResponse.value.data = null;
    guAuthResponse.value.error = null;
    guAuthResponse.value.event = null;
  }

  function setupGuAuthResponse() {
    const { error, session, event } = supaAuthResp.value;
    guAuthResponse.value.error = error;
    guAuthResponse.value.data = error ? null : session;
    guAuthResponse.value.event = event;
  }

  function setupAuthStore() {
    const { data: session } = guAuthResponse.value;
    authStore.setIsAuthenticated(true);
    authStore.setSession(session);
    authStore.setUser(session.user);
    authStore.setProfile(supaProfile.value);
  }

  function setupFudoStore() {
    fudoStore.setProfile(fudoProfile.value);
  }

  function resetAuthStore() {
    authStore.resetStore();
  }

  function resetFudoStore() {
    fudoStore.resetStore();
  }

  return {
    guAuthResponse,
    guLogin,
    guRegister,
    guLogout,
  };
}
