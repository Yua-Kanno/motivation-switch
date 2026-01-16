document.addEventListener("DOMContentLoaded", () => {
  const chatInput = document.getElementById("chatInput");
  const chatContent = document.getElementById("chatContent");
  const sendBtn = document.getElementById("sendBtn");
  const sessionStartBtn = document.querySelector(".start-btn"); 
  const missionList = document.getElementById("missionList");
  const progressText = document.getElementById("progressText");
  const progressFill = document.getElementById("progressFill");
  const calendarDay = document.getElementById("calendarDay");
  const modeLabel = document.getElementById("modeLabel");

  const dateInputs = document.querySelectorAll('input[type="date"]');
  const startInput = dateInputs[0];
  const endInput = dateInputs[1];

  let currentProgress = 0;
  let progressStep = 0;

  const achieveMessages = ["達成確認。出力、さらに上げろ。⚡", "一段突破。加速を維持しろ。🔥", "成功だ。まだ止まるな。"];

  const savedMode = localStorage.getItem("selectedMotivexMode") || "boost";
  if (modeLabel) modeLabel.textContent = `MODE: ${savedMode.toUpperCase()}`;

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
    const botMsg = addMessage("...", "system");

    setTimeout(() => {
      if (isLocked) {
        botMsg.textContent = "よそ見禁止！一気に終わらせるよ！🔥";
      } else {
        botMsg.textContent = "ミッションを確認！！";
        addMissionToList(text);
      }
    }, 600);
  }

  function addMissionToList(taskText) {
    if (!missionList) return;
    const item = document.createElement("div");
    item.className = "mission-item";
    item.innerHTML = `<span>${taskText}</span><button class="done-btn">完了</button>`;
    item.querySelector(".done-btn").addEventListener("click", function() {
      updateProgress(); 
      this.parentElement.remove(); 
      addMessage(`「${taskText}」達成！`, "system");
      setTimeout(() => {
        const msg = achieveMessages[Math.floor(Math.random() * achieveMessages.length)];
        addMessage(msg, "cheer");
      }, 400);
    });
    missionList.appendChild(item);
  }

  function updateProgress() {
    currentProgress += progressStep || 20;
    if (currentProgress > 100) currentProgress = 100;
    progressText.textContent = `${Math.round(currentProgress)}%`;
    progressFill.style.width = `${currentProgress}%`;
    if (currentProgress === 100) setTimeout(() => addMessage("ブースト最大出力。全任務達成！", "cheer"), 1000);
  }

  function updateDayStatus() {
    if (!startInput?.value || !endInput?.value) return;
    const total = Math.floor((new Date(endInput.value) - new Date(startInput.value)) / 86400000) + 1;
    let current = Math.floor((new Date() - new Date(startInput.value)) / 86400000) + 1;
    calendarDay.textContent = `DAY ${Math.max(1, Math.min(current, total))} / ${total}`;
  }

  sessionStartBtn?.addEventListener("click", () => {
    const missions = document.querySelectorAll(".mission-item");
    if (missions.length === 0) return;
    progressStep = 100 / missions.length;
    localStorage.setItem("missionsLocked", "true");
    startInput.disabled = true; endInput.disabled = true;
    sessionStartBtn.disabled = true;
    addMessage("セッション開始！固定したよ。", "system");
  });

  const d = new Date().toISOString().split('T')[0];
  startInput.value = d; endInput.value = d;
  updateDayStatus();
  sendBtn.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", (e) => e.key === "Enter" && sendMessage());
});