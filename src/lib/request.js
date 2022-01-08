import fetch from "node-fetch";
import { parse } from "node-html-parser";
import { addDay, formatDate } from "./dates.js";
import { REQUEST_TIMEOUT, WAIT_REQUEST_TIMEOUT } from "../contants/index.js";

/**
 * @typedef {Object} UrlData
 * @property {Date} date - Запрашиваемый день
 * @property {string} url - Ссылка
 */

function getRequestUrl(date) {
  const paramQuery = `baza/${formatDate(date)}`;
  return `https://kakoysegodnyaprazdnik.ru/${paramQuery}`;
}

/**
 * Получить массив ссылок для countDays дней
 * @param {Date} startDate С какой даты начинать делать ссылки
 * @param {number} countDays Сколько ссылок спрашивать
 * @param {Date} endDate За какую дату не заходить
 * @returns {UrlData}
 */
export function getUrls(startDate, countDays, endDate) {
  const urls = [{ date: startDate, url: getRequestUrl(startDate) }];
  for (let i = 1; i < countDays; i++) {
    let newDate = addDay(startDate, i);
    if (newDate > endDate) break;
    urls.push({ url: getRequestUrl(newDate), date: newDate });
  }
  return urls;
}

/**
 * Запрос списка праздников
 * @param {string} url
 * @param {Date} date
 * @returns {String[]}
 */
export async function getHolydays(url, date) {
  // Для отмены фетча
  const cancelFetch = new AbortController();
  // Промис запроса к сайту
  const promise = fetch(url, {
    timeout: REQUEST_TIMEOUT,
    signal: cancelFetch.signal,
  });
  // Время ожидания
  const timeout = setTimeout(() => {
    cancelFetch.abort();
  }, WAIT_REQUEST_TIMEOUT);
  try {
    const response = await promise;
    // Получить текст HTML
    const htmlContent = await response.text();
    // Получить структуру DOM
    const root = parse(htmlContent);
    // Массив праздников: DOM-элементы
    const source = root.querySelectorAll(".listing >.listing_wr span");
    // Массив праздников: текст
    const holidays = source.map((element) => element.textContent);
    return { holidays, day: date.getDate(), month: 1 + date.getMonth() };
  } catch (e) {
    console.log("FetchError :>> ", date);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
