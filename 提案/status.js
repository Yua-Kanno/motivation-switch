document.addEventListener("DOMContentLoaded", () => {
  const chatInput = document.getElementById("chatInput");
  const chatContent = document.getElementById("chatContent");
  const sendBtn = document.getElementById("sendBtn");
  const sessionStartBtn = document.querySelector(".start-btn"); 
  const missionList = document.getElementById("missionList");
  const missionSection = document.getElementById("missionSection");
  const progressText = document.getElementById("progressText");
  const progressFill = document.getElementById("progressFill");
  const calendarDay = document.getElementById("calendarDay");
  const modeDisplay = document.querySelector(".mode") || document.getElementById("modeLabel");

  const dateInputs = document.querySelectorAll('input[type="date"]');
  const startInput = dateInputs[0];
  const endInput = dateInputs[1];

  let currentProgress = 0;
  let progressStep = 0;

  // IGNITION用セリフ
  const achieveMessages = ["点火維持。ターゲット撃破。次を実行せよ。", "出力上昇。お前の限界はそこではない。🔥", "任務完了。次フェーズへ。"];

  const savedMode = localStorage.getItem('selectedMotivexMode') || 'ignition';
  if (modeDisplay) modeDisplay.textContent = `MODE: ${savedMode.toUpperCase()}`;

  function addMessage(text, type) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", type);
    msgDiv.textContent = text;
    chatContent.appendChild(msgDiv);
    chatContent.scrollTop = chatContent.scrollHeight;
  }

  function sendMessage() {
    const text = chatInput.value.trim();
    if (text === "") return;
    addMessage(text, "user");
    chatInput.value = "";
    const isLocked = localStorage.getItem("missionsLocked") === "true";

    setTimeout(() => {
      if (isLocked) {
        addMessage("イグニッション中だ。雑念を捨て、課題を焼き尽くせ。🗡️", "system");
      } else if (["こんにちは", "おはよう", "起動"].some(word => text.includes(word))) {
        addMessage("イグニッション点火。覚悟はいいか。ミッションを入力しろ。🔥", "system");
      } else {
        addMessage(`了解。ターゲット「${text}」をロックした。完遂しろ。`, "system");
        addMissionToList(text);
      }
    }, 600);
  }

  function addMissionToList(taskText) {
    const item = document.createElement("div");
    item.className = "mission-item";
    item.innerHTML = `<span>${taskText}</span><button class="done-btn">完了</button>`;
    item.querySelector(".done-btn").addEventListener("click", () => {
      updateProgress();
      item.remove();
      addMessage(`「${taskText}」排除完了。`, "system");
      setTimeout(() => {
        const msg = achieveMessages[Math.floor(Math.random() * achieveMessages.length)];
        addMessage(msg, "cheer");
      }, 400);
    });
    missionList.appendChild(item);
  }

  function updateProgress() {
    if (progressStep === 0) progressStep = 20;
    currentProgress += progressStep;
    if (currentProgress > 100) currentProgress = 100;
    progressText.textContent = `${Math.round(currentProgress)}%`;
    progressFill.style.width = `${currentProgress}%`;
    if (currentProgress === 100) {
      setTimeout(() => addMessage("全ミッション完了。限界突破。神の領域だ。🎊", "cheer"), 800);
    }
  }

  function updateDayStatus() {
    if (!startInput.value || !endInput.value) return;
    const start = new Date(startInput.value);
    const end = new Date(endInput.value);
    const today = new Date();
    start.setHours(0,0,0,0); end.setHours(0,0,0,0); today.setHours(0,0,0,0);
    const total = Math.floor((end - start) / 86400000) + 1;
    let current = Math.floor((today - start) / 86400000) + 1;
    current = Math.min(Math.max(current, 1), total);
    calendarDay.textContent = `DAY ${current} / ${total}`;
  }

  sessionStartBtn?.addEventListener("click", () => {
    const missions = document.querySelectorAll(".mission-item");
    if (missions.length === 0) return;
    progressStep = 100 / missions.length;
    localStorage.setItem("missionsLocked", "true");
    if(missionSection) missionSection.classList.add("is-locked");
    startInput.disabled = true; endInput.disabled = true;
    sessionStartBtn.disabled = true; sessionStartBtn.style.opacity = "0.5";
    addMessage("イグニッション開始。全力で叩き潰せ。🔥", "system");
  });

  localStorage.setItem("missionsLocked", "false");
  const todayVal = new Date().toISOString().split("T")[0];
  startInput.value = todayVal; endInput.value = todayVal;
  updateDayStatus();

  sendBtn.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", e => e.key === "Enter" && sendMessage());
  startInput.addEventListener("change", updateDayStatus);
  endInput.addEventListener("change", updateDayStatus);
});