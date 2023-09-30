import newMsg from "./newMsg";

const body = document.querySelector("body");
const timelineInput = document.querySelector(".timelineInput");
const timelineFormButtons = document.querySelector(".timelineFormButtons");
const timelineForm = document.querySelector(".timelineForm");
const buttonSendVideo = document.querySelector(".buttonSendVideo");
const timelineMsgs = document.querySelector(".timelineMsgs");
const timelineWrapper = document.querySelector(".timelineWrapper");

buttonSendVideo.addEventListener("click", () => {
  timelineFormButtons.classList.add("hide");
  timelineInput.value = "";
  timelineInput.disabled = true;
  videoHTML();
  getVideo();
});

async function getVideo() {
  const videoTimer = document.querySelector(".videoTimer");
  const videoButtonSumbit = document.querySelector(".videoButtonSumbit");
  const videoButtonCancel = document.querySelector(".videoButtonCancel");
  let timerId;
  let needToSave;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    const videoPreview = document.querySelector(".videoPreview");
    videoPreview.srcObject = stream;
    videoPreview.addEventListener("canplay", () => {
      videoPreview.play();
    });

    const recorder = new MediaRecorder(stream);
    const chunks = [];
    recorder.addEventListener("start", () => {
      videoTimer.textContent = `00:00`;
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
        videoTimer.textContent = `${minutesOutput}:${secondsOutput}`;
      }, 1000);
    });
    recorder.addEventListener("dataavailable", (e) => {
      chunks.push(e.data);
    });
    recorder.addEventListener("stop", () => {
      const blob = new Blob(chunks);
      if (needToSave) {
        newMsg(
          `<video class="video" src="${URL.createObjectURL(
            blob
          )}" controls></video>`
        );
      }
      videoPreview.remove();
      document.querySelector(".videoButtons").remove();
      timelineFormButtons.classList.remove("hide");
      timelineInput.disabled = false;
      clearInterval(timerId);
    });

    recorder.start();

    videoButtonSumbit.addEventListener("click", () => {
      needToSave = true;
      recorder.stop();
      stream.getTracks().forEach((track) => track.stop());
    });

    videoButtonCancel.addEventListener("click", () => {
      needToSave = false;
      recorder.stop();
      stream.getTracks().forEach((track) => track.stop());
    });
  } catch (err) {
    document.querySelector(".videoButtons").remove();
    document.querySelector(".videoPreview").remove();
    timelineFormButtons.classList.remove("hide");
    timelineInput.disabled = false;

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

function videoHTML() {
  timelineForm.insertAdjacentHTML(
    "beforeend",
    `
    <div class="videoButtons">
        <button class="videoButtonSumbit">✔</button>
        <p class="videoTimer">wait</p>
        <button class="videoButtonCancel">✖</button>
    </div>
    `
  );

  timelineMsgs.insertAdjacentHTML(
    "beforeend",
    `
    <video class="videoPreview" muted></video>
    `
  );
}

function errHTML() {
  body.insertAdjacentHTML(
    "afterbegin",
    `
    <div class="timelineErr">
        <div class="timelineErrText">Что-то пошло не так</div>
        <div class="timelineErrText">К сожалению, нам не удалось записать видео. Выдайте браузеру необходимые разрешения, или используйте другой браузер</div>
        <div class="timelineErrButtons">
            <button class="timelineErrButtonCancel">Ok</button>
        </div>
    </div>
    `
  );
}
