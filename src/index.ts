// import getHolydays from "@stanislavkarol/get-holidays";
import delay from "@stanislavkarol/delay";
import { addDay } from "./lib/dates";
import { getHolydays, getUrls } from "./lib/request";
import type { HolidayData } from "./types/holiday";

const startDate = new Date("2020-01-01");
const endDate = new Date("2020-01-02");
const COUNT_REQUEST = 2;
const DELAY = 1000;

(async function () {
  let loop = new Date(startDate);
  let holidayData: HolidayData[] = [];
  while (loop <= endDate) {
    const urlsData = getUrls(loop, COUNT_REQUEST, endDate);
    const promises = await Promise.all(
      urlsData.map(async (ud) => {
        const holidays = await getHolydays(ud.url);
        return { holidays, date: ud.date };
      })
    );
    holidayData = [...holidayData, ...promises] as any;
    loop = addDay(loop, COUNT_REQUEST);
    delay(DELAY);
  }

  console.log("holidayData :>> ", holidayData);
})();

// let loop = new Date(startDate);
// let requests: any[] = [];
// while (loop <= endDate) {
//   const urls = getUrls(loop, COUNT_REQUEST, endDate);

//   ///
//   requests = requests.concat(urls);
//   console.log(`loop`, loop);
//   ///
//   loop = addDay(loop, COUNT_REQUEST);
// }

// console.log("requests :>> ", requests);

// getHolydays("2001-02-29")
//   .then((list) => {
//     console.log(list.length);
//     if (list.length) {
//       console.log(list[0]);
//     }
//   })
//   .catch((err) => {
//     console.error(err);
//   });
