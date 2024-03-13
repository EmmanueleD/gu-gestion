<script setup>
import { ref } from "vue";

// COMPOSABLES
import useFudoApi from "@/composables/useFudoApi";
import useCustomToast from "@/composables/utils/useCustomToast";

// COMPOSABLES VARIABLES
const { getToken, fetchData, getCustomerByAttribute } = useFudoApi();
const { showSuccess, showError } = useCustomToast();

// COMPONENT VARIABLES
const loading = ref(false);
const token = ref("");
const error = ref("");
const endpoint = ref("customers");
const method = ref("GET");
const body = ref("");
const data = ref([]);
const page = ref({
  number: 1,
  size: 100,
});
const name = ref("");
const email = ref("");

async function fudoAuthenticate() {
  loading.value = true;
  try {
    token.value = await getToken();
    error.value = "";
  } catch (error) {
    token.value = "";
    error.value = error;
  } finally {
    loading.value = false;
  }
}

async function getData(endpoint, method, body) {
  loading.value = true;
  try {
    const response = await fetchData(endpoint, method, body);
    if (response.data) {
      data.value = response.data.filter((customer) => {
        return (
          (customer.attributes.name &&
            name.value.length > 0 &&
            customer.attributes.name
              .toLowerCase()
              .includes(name.value.toLocaleLowerCase())) ||
          (customer.attributes.email &&
            email.value.length > 0 &&
            customer.attributes.email
              .toLocaleLowerCase()
              .includes(email.value.toLocaleLowerCase()))
        );
      });

      showSuccess("Guardado exitoso");
    } else {
      showError("Error");
    }
  } catch (error) {
    console.error("error", error);
    showError(error);
  } finally {
    loading.value = false;
  }
}

async function getCustomer() {
  loading.value = true;
  data.value.splice(0);
  try {
    const response = await getCustomerByAttribute({
      key: "email",
      value: email.value,
    });
    if (response) {
      data.value = response.data;
      showSuccess("Guardado exitoso");
    } else {
      showError("Error");
    }
  } catch (error) {
    console.error("error", error);
    showError(error);
  } finally {
    loading.value = false;

    const dataValue = [];

    for (let item of data.value) {
      dataValue.push(item.attributes.name + " - " + item.id);
    }

    console.log("DATA VALUE", dataValue);
  }
}
</script>

<template>
  <h1>Test</h1>
  <div>
    <Button
      @click="fudoAuthenticate"
      icon="pi pi-key"
      class="w-auto"
      :loading="loading"
      label="FU.DO. AUTHENTICATE"
    ></Button>

    <Divider class="my-4"></Divider>

    <h1>Fetch data</h1>

    <div class="flex justify-content-start align-items-center flex-wrap gap-3">
      <InputText
        v-model="endpoint"
        placeholder="Endpoint"
        class="w-full"
      ></InputText>
      <InputText
        v-model="method"
        placeholder="Method"
        class="w-full"
      ></InputText>
      <InputText
        v-model="page.number"
        placeholder="Page Number"
        class="w-full"
      ></InputText>
      <InputText
        v-model="page.size"
        placeholder="Page Size"
        class="w-full"
      ></InputText>
      <InputText v-model="name" placeholder="Name" class="w-full"></InputText>
      <InputText v-model="email" placeholder="Email" class="w-full"></InputText>
      <InputText v-model="body" placeholder="Body" class="w-full"></InputText>

      <Button
        @click="getData(endpoint, method, body)"
        icon="pi pi-key"
        class="w-auto"
        :loading="loading"
        label="FETCH DATA"
      ></Button>
      <Button
        @click="getCustomer"
        icon="pi pi-key"
        class="w-auto"
        :loading="loading"
        label="GET CUSTOMER"
      ></Button>
      <Button
        @click="getToken"
        icon="pi pi-key"
        class="w-auto"
        :loading="loading"
        label="FU.DO. GET TOKEN"
      ></Button>
    </div>

    <Divider class="my-4"></Divider>

    <div v-if="loading">Cargando...</div>

    <div v-if="data" class="w-full grid">
      <div
        v-for="customer in data"
        :key="customer.id"
        class="col-12 md:col-6 lg:col-3 px-4 py-2"
      >
        <Card>
          <template #title>
            {{ customer.attributes.name }}
          </template>
          <template #content>
            <div class="w-full grid gap-3">
              <p class="w-full col-12">{{ customer.attributes.email }}</p>
              <p class="font-bold text-xl">
                {{
                  customer.attributes.houseAccountBalance.toLocaleString(
                    "es-AR",
                    {
                      style: "currency",
                      currency: "ARS",
                    }
                  )
                }}
              </p>
            </div>
          </template>
        </Card>
      </div>
    </div>
    <!-- <div v-if="token">Token: {{ token }}</div>
    <div v-if="error">Error: {{ error }}</div> -->
  </div>
</template>
