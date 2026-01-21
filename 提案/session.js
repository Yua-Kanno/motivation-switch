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

  // BOOST用セリフ
  const achieveMessages = [
  "ナイス達成！さらに加速していこう！⚡",
  "一段突破！君の集中力、本物だね！🔥",
  "成功だ！この勢いで次もいっちゃおう！",
  "その調子！ゾーンに入ってきたね！🚀",
  "完璧なリズム！次もサクッと終わらせちゃおう！✨",
  "一歩前進！着実にゴールが近づいてるよ！🚩",
  "最高。そのまま突き進もう！🎯",
  "加速が止まらない！この波に乗っていこう！🌊",
  "さすがだね！積み重ねた努力が形になってる！💎",
  "集中力、神レベル！👾"
];

  const savedMode = localStorage.getItem('selectedMotivexMode') || 'boost';
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
        addMessage("今はブースト中だよ！よそ見禁止、一気に終わらせよう！🔥", "system");
      } else if (["こんにちは", "おはよう", "ハロー"].some(word => text.includes(word))) {
        addMessage("ハロー！ブーストモード起動。今日はどの課題を爆速で終わらせる？🚀", "system");
      } else {
        addMessage(`了解！「${text}」をミッションに登録したよ。最高の結果を出そう！✨`, "system");
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
      addMessage(`「${taskText}」達成！最高だよ！`, "system");
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
      setTimeout(() => addMessage("全任務完了！ブースト最大出力、神すぎる！🎊", "cheer"), 800);
    }
  }

  // 日付計算 (これが DAY 1/3 を更新する肝)
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
    addMessage("セッション開始！ブースト全開でいくよ！🚀", "system");
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