import { useDateFormat } from "@vueuse/core";

export default function useDatetime() {
  function orderObjectsByDate(arrayOfObjects, dateKey, asc = true) {
    return arrayOfObjects.sort((a, b) => {
      const dateA = new Date(a[dateKey]);
      const dateB = new Date(b[dateKey]);
      return asc ? dateA - dateB : dateB - dateA;
    });
  }

  function getMonthNames(events, dateKey, from, to, lang = "es-AR") {
    const monthNames = [];

    const fromDate = new Date(from);
    const toDate = new Date(to);

    for (const event of events) {
      const eventDate = new Date(event[dateKey]);

      if (eventDate >= fromDate && eventDate <= toDate) {
        const monthName = useDateFormat(eventDate, "MMMM YYYY", {
          locales: lang,
        }).value;
        monthNames.push(monthName);
      }
    }

    return monthNames;
  }

  function countdownToBirthday(dateOfBirth) {
    const today = new Date();

    const currentYear = today.getFullYear();

    const dob = new Date(dateOfBirth);

    let nextBirthdayYear = currentYear;

    if (
      dob.getMonth() < today.getMonth() ||
      (dob.getMonth() === today.getMonth() && dob.getDate() < today.getDate())
    ) {
      nextBirthdayYear++;
    }

    const nextBirthday = new Date(
      nextBirthdayYear,
      dob.getMonth(),
      dob.getDate()
    );

    const difference = nextBirthday.getTime() - today.getTime();

    const daysUntilBirthday = Math.ceil(difference / (1000 * 60 * 60 * 24));

    return daysUntilBirthday;
  }

  function extractActivePeriods(periods) {
    // Sort periods by their creation date
    periods.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    let activePeriods = [];
    let currentPeriod = null;

    for (let period of periods) {
      if (period.status_id === 1) {
        // If current period is inactive, start a new active period
        if (!currentPeriod) {
          currentPeriod = { start: period.created_at, end: null };
        }
      } else if (period.status_id === 2) {
        // If current period is active, end it
        if (currentPeriod) {
          currentPeriod.end = period.created_at;
          activePeriods.push(currentPeriod);
          currentPeriod = null;
        }
      }
    }

    // If an active period is still ongoing, add it
    if (currentPeriod) {
      activePeriods.push({ start: currentPeriod.start, end: null });
    }

    return activePeriods;
  }

  function calculateTotalTime(intervals) {
    let totalTimeInMilliseconds = 0;

    for (let interval of intervals) {
      const start = new Date(interval.start);
      const end = interval.end ? new Date(interval.end) : new Date();
      totalTimeInMilliseconds += end - start;
    }

    const millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25;
    const totalTimeInYears = totalTimeInMilliseconds / millisecondsInYear;

    return totalTimeInYears;
  }

  function firstDayOfLastMonth() {
    var today = new Date(); // Get today's date
    var lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1); // Create a new date object for the first day of last month
    return (
      lastMonth.getFullYear() +
      "/" +
      (lastMonth.getMonth() + 1 < 10
        ? "0" + (lastMonth.getMonth() + 1)
        : lastMonth.getMonth() + 1) +
      "/01"
    ); // Format the date string
  }

  function firstDayOCurrentMonth() {
    var today = new Date(); // Get today's date
    var lastMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Create a new date object for the first day of last month
    return (
      lastMonth.getFullYear() +
      "/" +
      (lastMonth.getMonth() + 1 < 10
        ? "0" + (lastMonth.getMonth() + 1)
        : lastMonth.getMonth() + 1) +
      "/01"
    ); // Format the date string
  }

  function lastDayOfLastMonth() {
    var today = new Date(); // Get today's date
    var lastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Create a new date object for the last day of last month
    return (
      lastMonth.getFullYear() +
      "/" +
      (lastMonth.getMonth() + 1 < 10
        ? "0" + (lastMonth.getMonth() + 1)
        : lastMonth.getMonth() + 1) +
      "/" +
      (lastMonth.getDate() < 10
        ? "0" + lastMonth.getDate()
        : lastMonth.getDate())
    ); // Format the date string
  }

  function lastDayOfCurrentMonth() {
    var today = new Date(); // Get today's date
    var lastMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Create a new date object for the last day of last month
    return (
      lastMonth.getFullYear() +
      "/" +
      (lastMonth.getMonth() + 1 < 10
        ? "0" + (lastMonth.getMonth() + 1)
        : lastMonth.getMonth() + 1) +
      "/" +
      (lastMonth.getDate() < 10
        ? "0" + lastMonth.getDate()
        : lastMonth.getDate())
    ); // Format the date string
  }

  return {
    orderObjectsByDate,
    getMonthNames,
    countdownToBirthday,
    extractActivePeriods,
    calculateTotalTime,
    firstDayOfLastMonth,
    firstDayOCurrentMonth,
    lastDayOfLastMonth,
    lastDayOfCurrentMonth,
  };
}
