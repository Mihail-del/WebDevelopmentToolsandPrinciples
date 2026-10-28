// Compare calendar dates, ignoring the time stored in the API timestamp.
export function getDaysUntilBirthday(birthDate, now = dayjs()) {
    if (typeof birthDate !== "string" || !birthDate) return null;
    const datePart = birthDate.slice(0, 10);
    const birth = dayjs(datePart);
    const today = dayjs(now).startOf("day");
    if (!birth.isValid() || birth.format("YYYY-MM-DD") !== datePart ||
        !today.isValid() || birth.isAfter(today)) return null;

    // Day.js uses February 28 for February 29 in a non-leap year.
    let nextBirthday = birth.year(today.year());
    if (nextBirthday.isBefore(today)) {
        nextBirthday = birth.year(today.year() + 1);
    }
    return nextBirthday.diff(today, "day");
}
