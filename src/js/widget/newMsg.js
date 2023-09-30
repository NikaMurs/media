/* eslint-disable no-undef */
const moment = require("moment");
import "moment/locale/ru";
import positionErr from "./positionErr";
const timelineMsgs = document.querySelector(".timelineMsgs");

export default function newMsg(content) {
  const time = moment().format("L") + "<br>" + moment().format("LT");

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (data) => {
        const { latitude, longitude } = data.coords;
        const geo = `[${latitude.toFixed(5)}, ${longitude.toFixed(5)}]`;
        msgHTML(geo);
      },
      () => {
        positionErr(msgHTML);
      }
    );
  }

  function msgHTML(geo) {
    const coords = geo.substring(1, geo.length - 1).split(", ");
    const geoHref = `https://yandex.ru/maps/?pt=${coords[1]},${coords[0]}&z=15&l=map`;

    timelineMsgs.insertAdjacentHTML(
      "afterbegin",
      `
        <div class="timelineMsg">
            <div class="timelineContent">${content}</div>
            <div class="timelineTime">${time}</div>
            <a href="${geoHref}" class="timelinePos">${geo}</a>
        </div>
        `
    );
  }
}
