/* eslint-disable no-inner-declarations */
const body = document.querySelector("body");

export default function positionErr(callback) {
  const timelineWrapper = document.querySelector(".timelineWrapper");
  timelineWrapper.classList.add("tinting");
  errHTML();
  const timelinePosErrInput = document.querySelector(".timelineErrInput");
  const timelinePosErrButtonCancel = document.querySelector(
    ".timelineErrButtonCancel"
  );
  const timelinePosErrButtonSubmit = document.querySelector(
    ".timelineErrButtonSubmit"
  );

  timelinePosErrButtonSubmit.addEventListener("click", () => {
    if (timelinePosErrInput.value.trim()) {
      let isDone = false;

      function done(geo) {
        isDone = true;
        callback(geo);
        document.querySelector(".timelineErr").remove();
        timelineWrapper.classList.remove("tinting");
      }

      let geo = timelinePosErrInput.value.trim();
      if (/^\[{1}-?\d{1,2}\.\d{5}, -?\d{1,2}\.\d{5}\]{1}$/.test(geo)) {
        //[44.12345, 33.12345]
        done(geo);
      }
      if (/^-?\d{1,2}\.\d{5}, -?\d{1,2}\.\d{5}$/.test(geo)) {
        //44.12345, 33.12345
        geo = `[${geo}]`;
        done(geo);
      }
      if (/^-?\d{1,2}\.\d{5},-?\d{1,2}\.\d{5}$/.test(geo)) {
        //44.12345,33.12345
        const words = geo.split(",");
        geo = words[0] + ", " + words[1];
        geo = `[${geo}]`;
        done(geo);
      }

      if (!isDone) {
        timelinePosErrInput.value = "";
        timelinePosErrInput.placeholder = "Неверно введеные данные";
      }
    }
  });

  timelinePosErrButtonCancel.addEventListener("click", () => {
    document.querySelector(".timelineErr").remove();
    timelineWrapper.classList.remove("tinting");
  });
}

function errHTML() {
  body.insertAdjacentHTML(
    "afterbegin",
    `
    <div class="timelineErr">
        <div class="timelineErrText">Что-то пошло не так</div>
        <div class="timelineErrText">К сожалению, нам не удалость определить ваше местоположение, пожалуйста, дайте
        разрешение на использование геолоакции, либо введите координаты вручную.</div>
        <div class="timelineErrText">Широта и долгота через запятую</div>
        <input type="text" name="" id="" class="timelineErrInput" placeholder="51.50851, −0.12572">
        <div class="timelineErrButtons">
            <button class="timelineErrButtonCancel">Отмена</button>
            <button class="timelineErrButtonSubmit">Ok</button>
        </div>
    </div>
    `
  );
}
