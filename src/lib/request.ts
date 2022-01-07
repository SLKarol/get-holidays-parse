import fetch from "node-fetch";
import { parse } from "node-html-parser";
import type { HolidayUrl } from "src/types/holiday";
import { addDay, formatDate } from "./dates";

export async function getHolydays(url: string) {
  const response = await fetch(url);
  const htmlContent = await response.text();
  const root = parse(htmlContent);
  const source = root.querySelectorAll(".listing >.listing_wr span");
  const re = source.map((element) => element.textContent);
  return re;
}

function getRequestUrl(date: Date): string {
  const paramQuery = `baza/${formatDate(date)}`;
  // return `https://kakoysegodnyaprazdnik.ru/${paramQuery}`;
  return `http://200.200.200.200/${paramQuery}`;
}

export function getUrls(
  startDate: Date,
  countDays: number,
  endDate: Date
): HolidayUrl[] {
  const urls = [{ date: startDate, url: getRequestUrl(startDate) }];
  for (let i = 1; i < countDays; i++) {
    let newDate = addDay(startDate, i);
    if (newDate > endDate) break;
    urls.push({ url: getRequestUrl(newDate), date: newDate });
  }
  return urls;
}
