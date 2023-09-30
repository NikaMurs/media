import newMsg from "./newMsg";

const timeline = document.querySelector(".timeline");
const timelineForm = timeline.querySelector(".timelineForm");
const timelineInput = timelineForm.querySelector(".timelineInput");

timelineForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (timelineInput.value.trim()) {
    newMsg(timelineInput.value.trim());
    timelineInput.value = "";
  }
});
