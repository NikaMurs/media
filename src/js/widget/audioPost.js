import newMsg from "./newMsg";

const body = document.querySelector("body");
const timelineInput = document.querySelector(".timelineInput");
const timelineFormButtons = document.querySelector(".timelineFormButtons");
const timelineForm = document.querySelector(".timelineForm");
const buttonSendAudio = document.querySelector(".buttonSendAudio");
const timelineWrapper = document.querySelector(".timelineWrapper");

buttonSendAudio.addEventListener("click", () => {
  timelineFormButtons.classList.add("hide");
  timelineInput.value = "";
  timelineInput.disabled = true;
  audioHTML();
  getAudio();
});

async function getAudio() {
  const auidoTimer = document.querySelector(".auidoTimer");
  const audioButtonSumbit = document.querySelector(".audioButtonSumbit");
  const audioButtonCancel = document.querySelector(".audioButtonCancel");
  let timerId;
  let needToSave;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    const recorder = new MediaRecorder(stream);
    const chunks = [];
    recorder.addEventListener("start", () => {
      auidoTimer.textContent = `00:00`;
      let seconds = 0;
      let minutes = 0;
      let secondsOutput;
      let minutesOutput;
      timerId = setInterval(() => {
        seconds += 1;
        if (seconds == 60) {
          minutes += 1;
          seconds = 0;
        }

        if (seconds < 10) {
          secondsOutput = "0" + seconds;
        } else {
          secondsOutput = seconds;
        }
        if (minutes < 10) {
          minutesOutput = "0" + minutes;
        } else {
          minutesOutput = minutes;
        }
        auidoTimer.textContent = `${minutesOutput}:${secondsOutput}`;
      }, 1000);
    });
    recorder.addEventListener("dataavailable", (e) => {
      chunks.push(e.data);
    });
    recorder.addEventListener("stop", () => {
      const blob = new Blob(chunks);
      if (needToSave) {
        newMsg(
          `<audio class="audio" src="${URL.createObjectURL(
            blob
          )}" controls></audio>`
        );
      }
      document.querySelector(".audioButtons").remove();
      timelineFormButtons.classList.remove("hide");
      timelineInput.disabled = false;
      clearInterval(timerId);
    });

    recorder.start();

    audioButtonSumbit.addEventListener("click", () => {
      needToSave = true;
      recorder.stop();
      stream.getTracks().forEach((track) => track.stop());
    });

    audioButtonCancel.addEventListener("click", () => {
      needToSave = false;
      recorder.stop();
      stream.getTracks().forEach((track) => track.stop());
    });
  } catch (err) {
    document.querySelector(".audioButtons").remove();
    timelineFormButtons.classList.remove("hide");

    timelineWrapper.classList.add("tinting");
    errHTML();
    const timelineErrButtonCancel = document.querySelector(
      ".timelineErrButtonCancel"
    );
    timelineErrButtonCancel.addEventListener("click", () => {
      timelineWrapper.classList.remove("tinting");
      document.querySelector(".timelineErr").remove();
    });
  }
}

function audioHTML() {
  timelineForm.insertAdjacentHTML(
    "beforeend",
    `
    <div class="audioButtons">
        <button class="audioButtonSumbit">✔</button>
        <p class="auidoTimer">wait</p>
        <button class="audioButtonCancel">✖</button>
    </div>
    `
  );
}

function errHTML() {
  body.insertAdjacentHTML(
    "afterbegin",
    `
    <div class="timelineErr">
        <div class="timelineErrText">Что-то пошло не так</div>
        <div class="timelineErrText">К сожалению, нам не удалось записать аудио. Выдайте браузеру необходимые разрешения, или используйте другой браузер</div>
        <div class="timelineErrButtons">
            <button class="timelineErrButtonCancel">Ok</button>
        </div>
    </div>
    `
  );
}
