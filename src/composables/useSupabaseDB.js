import { ref } from "vue";
import useSupabaseClient from "./useSupabaseClient";

export default function useSupabaseDB() {
  const { sbDB } = useSupabaseClient();

  const dbResp = ref(null);

  async function get({ table, id }) {
    const { data, error } = await sbDB(table).select("*").eq("id", id).single();
    if (!error) {
      return data;
    } else {
      return error;
    }
  }

  async function getAll({ table }) {
    const { data, error } = await sbDB(table).select("*");
    if (!error) {
      return data;
    } else {
      return error;
    }
  }

  async function create({ table, data }) {
    const { error } = await sbDB(table).insert(data);
    if (!error) {
      return data;
    } else {
      return error;
    }
  }

  async function update({ table, id, data }) {
    const { error } = await sbDB(table).update(data).eq("id", id);
    if (!error) {
      return data;
    } else {
      return error;
    }
  }

  async function remove({ table, id }) {
    const { error } = await sbDB(table).delete().eq("id", id);
    if (!error) {
      return true;
    } else {
      return error;
    }
  }

  return {
    dbResp,
    get,
    getAll,
    create,
    update,
    remove,
  };
}
