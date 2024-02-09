import { ref } from "vue";
import axios from "axios";

export default function useFudoApi() {
  const fudoAuthUrl = import.meta.env.VITE_FUDO_AUTH_URL;
  const fudoApiUrl = import.meta.env.VITE_FUDO_API_URL;
  const fudoKey = import.meta.env.VITE_FUDO_KEY;
  const fudoSecret = import.meta.env.VITE_FUDO_SECRET;
  const token = ref(
    "eyJhbGciOiJIUzI1NiJ9.eyJhaSI6NjQ0NywidWkiOjQ0MzAyLCJleHAiOjE3MDc1ODU0MjR9.BxG67kh6QsiQ7rXoYInBinEtq8WTstSmI2Wb8K5AJEY"
  );

  async function getToken() {
    try {
      const response = await axios.post(
        `${fudoAuthUrl}`,
        {
          apiKey: fudoKey,
          apiSecret: fudoSecret,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const data = response.data;
      if (response.status === 200) {
        token.value = data.token;
        return data.token;
      } else {
        throw new Error(data.message || "Failed to get token");
      }
    } catch (error) {
      console.error("Error while obtaining token:", error);
      throw error;
    }
  }

  async function fetchData(endpoint, method = "GET", body = null) {
    // if (!token.value) {
    //   await getToken();
    // }

    try {
      const headers = {
        Authorization: `Bearer ${token.value}`,
      };

      let options = { method, headers };

      if (body) {
        options.data = body;
      }

      const response = await axios(`${fudoApiUrl}/${endpoint}`, options);

      if (response) {
        return response.data;
      } else {
        return response;
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
      throw error;
    }
  }

  async function getCustomerByAttribute(
    attribute,
    method = "GET",
    body = null
  ) {
    if (!token.value) {
      await getToken();
    }

    try {
      const headers = {
        Authorization: `Bearer ${token.value}`,
      };

      let options = { method, headers };

      if (body) {
        options.data = body;
      }

      let page = {
        number: 1,
        size: 500,
      };

      let result = [];
      let currentPage = [];

      do {
        currentPage.splice(0);
        let filteredResults = [];
        let res = await axios(
          `${fudoApiUrl}/customers?page[number]=${page.number}&page[size]=${page.size}`,
          options
        );

        currentPage = res.data.data;

        filteredResults = currentPage.filter((customer) => {
          if (!customer.attributes[attribute.key]) {
            return false;
          }

          if (
            customer.attributes[attribute.key]
              .toLowerCase()
              .includes(attribute.value.toLowerCase())
          ) {
            return true;
          }

          return false;
        });

        result = result.concat(filteredResults);

        page.number = page.number + 1;
      } while (currentPage.length > 0);

      return result;
    } catch (error) {
      throw error;
    }
  }

  return { getToken, fetchData, getCustomerByAttribute };
}
