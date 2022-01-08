import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import delay from "@stanislavkarol/delay";

import { addDay } from "./lib/dates.js";
import { getUrls, getHolydays } from "./lib/request.js";
import { COUNT_REQUEST, DELAY_REQUEST } from "./contants/index.js";

const startDate = new Date("2020-01-01");
const endDate = new Date("2020-12-31");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let loop = new Date(startDate);
let holidayData = [];
while (loop <= endDate) {
  // Получить URLs для выбранных дат
  const urlsData = getUrls(loop, COUNT_REQUEST, endDate);
  try {
    const promisesOfHolidays = await Promise.all(
      urlsData.map(async (ud) => await getHolydays(ud.url, ud.date))
    );
    holidayData = [
      ...holidayData,
      ...promisesOfHolidays.filter((r) => r !== null),
    ];
  } catch (e) {
    console.error(e);
  }
  loop = addDay(loop, COUNT_REQUEST);
  await delay(DELAY_REQUEST);
}

if (!fs.existsSync(`${__dirname}/../json`)) {
  fs.mkdirSync(`${__dirname}/../json`);
}

fs.writeFile(
  `${__dirname}/../json/holidays.json`,
  JSON.stringify(holidayData),
  (err) => {
    if (err) throw err;
    console.log("Data written to file");
  }
);

console.log("Count holidayDays :>> ", holidayData.length);
