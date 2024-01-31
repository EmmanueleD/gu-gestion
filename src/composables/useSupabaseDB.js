import { ref } from "vue";
import useSupabaseClient from "./useSupabaseClient";

export default function useSupabaseDB() {
  const { sbDB } = useSupabaseClient();

  const dbResp = ref(null);

  async function get({ table, id }) {
    const { data, error } = await sbDB(table).select("*").eq("id", id).single();
    if (!error) {
      dbResp.value = data;
      return "Supabase DB get OK";
    } else {
      dbResp.value = error;
      return "Supabase DB get error";
    }
  }

  async function getAll({ table }) {
    const { data, error } = await sbDB(table).select("*");
    if (!error) {
      dbResp.value = data;
      return "Supabase DB get all OK";
    } else {
      dbResp.value = error;
      return "Supabase DB get all error";
    }
  }

  async function getLastOne({ table, orderingBy = table + "_id" }) {
    const { data, error } = await sbDB(table)
      .select("*")
      .order(orderingBy, { ascending: false })
      .limit(1);
    if (!error) {
      dbResp.value = data;
      return "Supabase DB get last one OK";
    } else {
      dbResp.value = error;
      return "Supabase DB get last one error";
    }
  }

  async function create({ table, data }) {
    const { error } = await sbDB(table).insert(data);
    if (!error) {
      dbResp.value = data;
      return "Supabase DB create OK";
    } else {
      dbResp.value = error;
      return "Supabase DB create error";
    }
  }

  async function update({ table, id, data }) {
    const { error } = await sbDB(table).update(data).eq("id", id);
    if (!error) {
      dbResp.value = data;
      return "Supabase DB update OK";
    } else {
      dbResp.value = error;
      return "Supabase DB update error";
    }
  }

  async function remove({ table, id }) {
    const { error } = await sbDB(table).delete().eq("id", id);
    if (!error) {
      dbResp.value = id;
      return "Supabase DB remove OK";
    } else {
      dbResp.value = error;
      return "Supabase DB remove error";
    }
  }

  return {
    dbResp,
    get,
    getAll,
    getLastOne,
    create,
    update,
    remove,
  };
}
