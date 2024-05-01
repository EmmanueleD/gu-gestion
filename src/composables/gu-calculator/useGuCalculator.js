export default function useGuCalculator() {
  const baseUrl = import.meta.env.VITE_GU_CALCULATOR_BASE_URL;

  async function getDataFromFile(fileUrl) {
    try {
      const response = await fetch(baseUrl + fileUrl).then((res) => res.json());
      // const response = await fetch(
      //   "http://localhost:3000/api/v1/" + fileUrl
      // ).then((res) => res.json());
      if (response) return response.data;
      return { error: "File not found" };
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    getDataFromFile,
  };
}
