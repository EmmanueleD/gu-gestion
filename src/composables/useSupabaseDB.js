import { ref } from "vue";
import useSupabaseClient from "./useSupabaseClient";

export default function useSupabaseDB() {
  const { sbDB } = useSupabaseClient();
  const dbResp = ref(null);
  const dbResponseStatus = ref(null);

  async function handleRequest(requestPromise) {
    dbResponseStatus.value = "PENDING";
    try {
      const { data, error } = await requestPromise;
      if (error) {
        throw new Error(error.message);
      } else {
        dbResponseStatus.value = "OK";
      }
      return data;
    } catch (error) {
      dbResponseStatus.value = error.message;
      throw new Error("Supabase DB request error: " + error.message);
    }
  }

  async function get({ table, id = { key: table + "_id", value: null } }) {
    const requestPromise = sbDB(table)
      .select("*")
      .eq(id.key, id.value)
      .single();
    dbResp.value = await handleRequest(requestPromise);
  }

  async function getAll({
    table,
    orderingBy = table + "_id",
    ascending = false,
  }) {
    const requestPromise = sbDB(table)
      .select("*")
      .order(orderingBy, { ascending });
    dbResp.value = await handleRequest(requestPromise);
  }

  async function getWithFilter({
    table,
    filter,
    orderingBy = table + "_id",
    ascending = false,
    filterType = "eq",
  }) {
    let requestPromise;
    switch (filterType) {
      case "eq":
        requestPromise = sbDB(table)
          .select("*")
          .order(orderingBy, { ascending })
          .eq(filter.column, filter.value);
        break;
      case "gt":
        requestPromise = sbDB(table)
          .select("*")
          .order(orderingBy, { ascending })
          .gt(filter.column, filter.value);
        break;
      case "lt":
        requestPromise = sbDB(table)
          .select("*")
          .order(orderingBy, { ascending })
          .lt(filter.column, filter.value);
        break;
      case "gte":
        requestPromise = sbDB(table)
          .select("*")
          .order(orderingBy, { ascending })
          .gte(filter.column, filter.value);
        break;
      case "lte":
        requestPromise = sbDB(table)
          .select("*")
          .order(orderingBy, { ascending })
          .lte(filter.column, filter.value);
        break;
      case "like":
        requestPromise = sbDB(table)
          .select("*")
          .order(orderingBy, { ascending })
          .like(filter.column, filter.value);
        break;
      case "ilike":
        requestPromise = sbDB(table)
          .select("*")
          .order(orderingBy, { ascending })
          .ilike(filter.column, filter.value);
        break;
      case "is":
        requestPromise = sbDB(table)
          .select("*")
          .order(orderingBy, { ascending })
          .is(filter.column, filter.value);
        break;
      case "in":
        requestPromise = sbDB(table)
          .select("*")
          .order(orderingBy, { ascending })
          .in(filter.column, filter.value);
        break;
      case "neq":
        requestPromise = sbDB(table)
          .select("*")
          .order(orderingBy, { ascending })
          .neq(filter.column, filter.value);
        break;
      default:
        throw new Error("Invalid filterType");
    }

    dbResp.value = await handleRequest(requestPromise);
  }

  async function getLastOne({
    table,
    orderingBy = table + "_id",
    ascending = false,
  }) {
    const requestPromise = sbDB(table)
      .select("*")
      .order(orderingBy, { ascending })
      .limit(1);
    dbResp.value = await handleRequest(requestPromise);
  }

  async function create({ table, data }) {
    const requestPromise = sbDB(table).insert(data).select();
    dbResp.value = await handleRequest(requestPromise);
  }

  async function update({
    table,
    id = { key: table + "_id", value: null },
    data,
  }) {
    const requestPromise = sbDB(table)
      .update(data)
      .eq(id.key, id.value)
      .select();
    dbResp.value = await handleRequest(requestPromise);
  }

  async function remove({ table, id }) {
    const requestPromise = sbDB(table).delete().eq(id.key, id.value);
    dbResp.value = await handleRequest(requestPromise);
  }

  async function supaLog(note) {
    const requestPromise = sbDB("gest_log").insert({ note }).select();
    dbResp.value = await handleRequest(requestPromise);
  }

  return {
    dbResponseStatus,
    dbResp,
    get,
    getAll,
    getWithFilter,
    getLastOne,
    create,
    update,
    remove,
    supaLog,
  };
}
