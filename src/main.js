import "./assets/main.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "@/assets/layout/layout.scss";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import PrimeVueConfigurator from "./utils/PrimeVueConfigurator";

const pinia = createPinia();

const app = createApp(App);

app.use(pinia);
app.use(router);

PrimeVueConfigurator.init(app);

app.mount("#app");
