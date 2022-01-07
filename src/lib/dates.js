const mothNamesKakoysegodnyaprazdnik = [
  "yanvar",
  "fevral",
  "mart",
  "aprel",
  "may",
  "iyun",
  "iyul",
  "avgust",
  "sentyabr",
  "oktyabr",
  "noyabr",
  "dekabr",
];

/**
 * Форматирует дату для запроса праздников
 * @param date - Дата
 */
export function formatDate(date) {
  return `${mothNamesKakoysegodnyaprazdnik[date.getMonth()]}/${date.getDate()}`;
}

export function addDay(date, countDays = 1) {
  const newDate = new Date(date);
  return new Date(newDate.setDate(newDate.getDate() + countDays));
}
