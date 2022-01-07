import fetch from "node-fetch";
import { parse } from "node-html-parser";
import { addDay, formatDate } from "./dates.js";
import { REQUEST_TIMEOUT, WAIT_REQUEST_TIMEOUT } from "../contants/index.js";

function getRequestUrl(date) {
  const paramQuery = `baza/${formatDate(date)}`;
  return `https://kakoysegodnyaprazdnik.ru/${paramQuery}`;
  // return `http://200.200.200.200/${paramQuery}`;
}

export function getUrls(startDate, countDays, endDate) {
  const urls = [{ date: startDate, url: getRequestUrl(startDate) }];
  for (let i = 1; i < countDays; i++) {
    let newDate = addDay(startDate, i);
    if (newDate > endDate) break;
    urls.push({ url: getRequestUrl(newDate), date: newDate });
  }
  return urls;
}

export async function getHolydays(url, date) {
  const cancelFetch = new AbortController();
  const promise = fetch(url, {
    timeout: REQUEST_TIMEOUT,
    signal: cancelFetch.signal,
  });
  const timeout = setTimeout(() => {
    cancelFetch.abort();
  }, WAIT_REQUEST_TIMEOUT);
  try {
    const response = await promise;
    const htmlContent = await response.text();
    const root = parse(htmlContent);
    const source = root.querySelectorAll(".listing >.listing_wr span");
    const holidays = source.map((element) => element.textContent);
    return { holidays, day: date.getDate(), month: 1 + date.getMonth() };
  } catch (e) {
    console.log("FetchError :>> ", date);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
