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

  return {
    orderObjectsByDate,
    getMonthNames,
    countdownToBirthday,
  };
}
