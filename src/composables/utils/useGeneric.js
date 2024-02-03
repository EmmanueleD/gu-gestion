export default function useGeneric() {
  function decimalToHoursMinutes(decimalHours) {
    // Separate the decimal into whole hours and fractional minutes
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);

    // Format the result as "hh:mm"
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}`;
  }

  function formatCurrency(value, locale = "es-AR") {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "ARS",
    }).format(value);
  }

  return {
    decimalToHoursMinutes,
    formatCurrency,
  };
}
