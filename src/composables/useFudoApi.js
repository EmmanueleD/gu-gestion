import { ref } from "vue";
import axios from "axios";

export default function useFudoApi() {
  const token = ref(null);

  async function getToken() {
    try {
      const response = await axios.get(
        "https://gu-calulator.vercel.app/api/v1/fudo-api/token"
        // "http://localhost:3000/api/v1/fudo-api/token"
      );

      const data = response.data;
      if (response.status === 200) {
        token.value = data.data;

        return token.value;
      } else {
        throw new Error(data.message || "Failed to get token");
      }
    } catch (error) {
      console.error("Error while obtaining token:", error);
      throw error;
    }
  }

  async function fetchData(endpoint, method = "GET", body = null) {
    if (body) {
      body = encodeURIComponent(JSON.stringify(body));
    }

    const url = `https://gu-calulator.vercel.app/api/v1/fudo-api/fetch/${method}/${encodeURIComponent(
      endpoint
    )}/${body}`;

    // const url = `http://localhost:3000/api/v1/fudo-api/fetch/${method}/${encodeURIComponent(
    //   endpoint
    // )}/${body}`;

    try {
      const response = await axios({
        method: method,
        url: url,
      });

      return response.data;
    } catch (error) {
      console.error("Error while fetching data:", error);
      throw error;
    }
  }

  async function getCustomerByAttribute(attribute) {
    try {
      const result = await axios.get(
        "https://gu-calulator.vercel.app/api/v1/fudo-api/customer/attribute/" +
          // "http://localhost:3000/api/v1/fudo-api/customer/attribute/" +
          attribute.key +
          "/" +
          attribute.value
      );

      if (result.data.status == "OK") {
        return result.data.data;
      } else {
        return result.data;
      }
    } catch (error) {
      throw error;
    }
  }

  // FUDO API CONNECTION NEW ENDPOINTS

  async function getFudoCustomerList() {
    try {
      const result = await axios.get(
        "https://gu-calulator.vercel.app/api/v1/fudo-api/customers"
        // "http://localhost:3000/api/v1/fudo-api/customers"
      );

      console.log(result);

      if (result.data.status == "OK") {
        return result.data.data;
      } else {
        return result.data;
      }
    } catch (error) {
      throw error;
    }
  }

  async function getFudoCustomer(customerId) {
    try {
      const result = await axios.get(
        "https://gu-calulator.vercel.app/api/v1/fudo-api/customer/" + customerId
        // "http://localhost:3000/api/v1/fudo-api/customer/" + customerId
      );

      if (result.data.status == "OK") {
        return result.data.data;
      } else {
        return result.data;
      }
    } catch (error) {
      throw error;
    }
  }

  async function postFudoCustomer(
    newCustomer = {
      data: {
        type: "Customer",
        attributes: {
          active: true,
          address: "",
          comment: "TEST GU-PLATFORM",
          houseAccountEnabled: false,
          name: "TEST NAME",
          email: "testerino@testrino.com",
        },
      },
    }
  ) {
    try {
      const result = await axios.post(
        "https://gu-calulator.vercel.app/api/v1/fudo-api/customer",
        // "http://localhost:3000/api/v1/fudo-api/customer",
        newCustomer
      );

      if (result.data.status == "OK") {
        return result.data.data;
      } else {
        return result.data;
      }
    } catch (error) {
      throw error;
    }
  }

  async function putFudoCustomer() {}

  async function deleteFudoCustomer() {}

  async function getFudoDiscountList() {}

  async function getFudoDiscount() {}

  async function postFudoDiscount() {}

  async function putFudoDiscount() {}

  async function deleteFudoDiscount() {}

  async function getFudoExpenseList() {}

  async function getFudoExpense() {}

  async function postFudoExpense() {}

  async function putFudoExpense() {}

  async function getFudoExpenseCategoryList() {}

  async function getFudoExpenseCategory() {}

  async function postFudoExpenseCategory() {}

  async function putFudoExpenseCategory() {}

  async function deleteFudoExpenseCategory() {}

  async function getFudoIngredientList() {}

  async function getFudoItemList() {}

  async function getFudoItem() {}

  async function postFudoItem() {}

  async function putFudoItem() {}

  async function getFudoKtchenList() {}

  async function getFudoKitchen() {}

  async function postFudoKitchen() {}

  async function putFudoKitchen() {}

  async function deleteFudoKitchen() {}

  async function getFudoPaymentList() {}

  async function getFudoPayment() {}

  async function postFudoPayment() {}

  async function putFudoPayment() {}

  async function getFudoPaymentMethodList() {}

  async function getFudoPaymentMethod() {}

  async function getFudoProductCategoryList() {}

  async function getFudoProductCategory() {}

  async function postFudoProductCategory() {}

  async function putFudoProductCategory() {}

  async function getFudoProductModifierList() {}

  async function getFudoProductModifier() {}

  async function postFudoProductModifier() {}

  async function putFudoProductModifier() {}

  async function getFudoProductList() {}

  async function getFudoProduct() {}

  async function postFudoProduct() {}

  async function putFudoProduct() {}

  async function getFudoRoleList() {}

  async function getFudoRole() {}

  async function postFudoRole() {}

  async function putFudoRole() {}

  async function getFudoRoomList() {}

  async function getFudoRoom() {}

  async function postFudoRoom() {}

  async function putFudoRoom() {}

  async function getFudoSaleList(page) {
    try {
      const result = await axios.get(
        "https://gu-calulator.vercel.app/api/v1/fudo-api/sales-by-page/" + page
      );

      console.log("result", result.data.status);

      if (result.data.status == "OK") {
        return result.data.data;
      } else {
        return result.data;
      }
    } catch (error) {
      throw error;
    }
  }

  async function getFudoSale() {}

  async function postFudoSale() {}

  async function putFudoSale() {}

  async function getFudoTableList() {}

  async function getFudoTable() {}

  async function postFudoTable() {}

  async function putFudoTable() {}

  async function getFudoUserList() {
    try {
      const result = await axios.get(
        "https://gu-calulator.vercel.app/api/v1/fudo-api/users"
        // "http://localhost:3000/api/v1/fudo-api/users"
      );

      console.log(result);

      if (result.data.status == "OK") {
        return result.data.data;
      } else {
        return result.data;
      }
    } catch (error) {
      throw error;
    }
  }

  async function getFudoUser(userId) {
    try {
      const result = await axios.get(
        "https://gu-calulator.vercel.app/api/v1/fudo-api/user/" + userId
        // "http://localhost:3000/api/v1/fudo-api/user/" + userId
      );

      if (result.data.status == "OK") {
        return result.data.data;
      } else {
        return result.data;
      }
    } catch (error) {
      throw error;
    }
  }

  async function postFudoUser(
    newUser = {
      data: {
        type: "User",
        attributes: {
          active: true,
          admin: false,
          email: "teststaff@test.com",
          name: "TEST STAFF",
          password: "gu123123",
        },
        relationships: {
          role: {
            data: {
              id: "21",
              type: "Role",
            },
          },
        },
      },
    }
  ) {
    try {
      const result = await axios.post(
        "https://gu-calulator.vercel.app/api/v1/fudo-api/user",
        // "http://localhost:3000/api/v1/fudo-api/user",
        newUser
      );

      if (result.data.status == "OK") {
        return result.data.data;
      } else {
        return result.data;
      }
    } catch (error) {
      throw error;
    }
  }

  async function putFudoUser() {}

  return {
    getToken,
    fetchData,
    getCustomerByAttribute,

    getFudoCustomerList,
    getFudoCustomer,
    postFudoCustomer,

    getFudoUserList,
    getFudoUser,
    postFudoUser,

    getFudoSaleList,
  };
}
