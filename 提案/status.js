// ==============================
// 0. 要素の取得（省略なし）
// ==============================
const chatInput = document.getElementById("chatInput");
const chatContent = document.getElementById("chatContent");
const sendBtn = document.getElementById("sendBtn");
const sessionStartBtn = document.querySelector(".start-btn"); 
const missionList = document.getElementById("missionList");
const missionSection = document.getElementById("missionSection");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

const dateInputs = document.querySelectorAll('input[type="date"]');
const startInput = dateInputs[0];
const endInput = dateInputs[1];
const calendarDay = document.getElementById("calendarDay");

let currentProgress = 0;
let progressStep = 0;

// 完了時専用の褒め言葉リスト
const achieveMessages = [
  "点火維持。次を実行。",
  "出力上昇。止まるな。",
  "成功確認。加速継続。",
  "進行良好。限界突破。",
  "任務完了。次フェーズへ。"
];



// ==============================
// 1. チャット機能（追加時の応援をカット）
// ==============================
function addMessage(text, type) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", type);
  msgDiv.textContent = text;
  chatContent.appendChild(msgDiv);
  chatContent.scrollTop = chatContent.scrollHeight;
  return msgDiv;
}

function sendMessage() {
  const text = chatInput.value.trim();
  if (text === "") return;

  addMessage(text, "user");
  chatInput.value = "";

  const isLocked = localStorage.getItem("missionsLocked") === "true";
  const botMsg = addMessage("...", "system");

  setTimeout(() => {
    const greetings = ["こんにちは", "こんばんは", "おはよう", "ハロー", "はじめまして"];
    const isGreeting = greetings.some(word => text.includes(word));

    if (isLocked) {
      botMsg.textContent = "今はセッション中だよ！集中！";
    } else if (isGreeting) {
      botMsg.textContent = "起動完了。ミッションを指定せよ。";
    } else {
      // タスク登録時はシンプルにこれだけ
      botMsg.textContent = "ミッション登録完了⭐️";
      addMissionToList(text);
      // ★ ここにあった応援メッセージのsetTimeoutを削除しました
    }
  }, 600);
}

// ==============================
// 2. ミッションリスト（完了時に全力で褒める）
// ==============================
function addMissionToList(taskText) {
  if (!missionList) return;
  const item = document.createElement("div");
  item.className = "mission-item";
  item.innerHTML = `<span>${taskText}</span><button class="done-btn">完了</button>`;

  item.querySelector(".done-btn").addEventListener("click", function() {
    updateProgress(); 
    this.parentElement.remove(); 
    
    // 達成報告
    addMessage(`「${taskText}」達成！`, "system");

    // ★ 完了した時だけ、色を変えて褒める！
    setTimeout(() => {
      const randomAchieve = achieveMessages[Math.floor(Math.random() * achieveMessages.length)];
      addMessage(randomAchieve, "cheer");
    }, 400);
  });
  
  missionList.appendChild(item);
}

// ==============================
// 3. その他（進捗・カレンダー・初期化）
// ==============================
function updateProgress() {
  if (progressStep === 0) progressStep = 20; 
  currentProgress += progressStep;
  if (currentProgress > 100) currentProgress = 100;
  if (progressText) progressText.textContent = `${Math.round(currentProgress)}%`;
  if (progressFill) progressFill.style.width = `${currentProgress}%`;
  
  if (currentProgress === 100) {
    setTimeout(() => addMessage("全任務完了。出力、限界突破。", "cheer"), 1000);


  }
}

function updateDayStatus() {
  if (!startInput?.value || !endInput?.value) return;
  const start = new Date(startInput.value);
  const end = new Date(endInput.value);
  const today = new Date();
  start.setHours(0,0,0,0); end.setHours(0,0,0,0); today.setHours(0,0,0,0);
  const total = Math.floor((end - start) / 86400000) + 1;
  let current = Math.floor((today - start) / 86400000) + 1;
  if (current < 1) current = 1; if (current > total) current = total;
  if (calendarDay) calendarDay.textContent = `DAY ${current} / ${total < 1 ? 1 : total}`;
}

if (sessionStartBtn) {
  sessionStartBtn.addEventListener("click", () => {
    const missions = document.querySelectorAll(".mission-item");
    if (missions.length === 0) { addMessage("ミッションがないよ！", "system"); return; }
    progressStep = 100 / missions.length;
    localStorage.setItem("missionsLocked", "true");
    if (missionSection) missionSection.classList.add("is-locked");
    startInput.disabled = true; endInput.disabled = true;
    sessionStartBtn.style.opacity = "0.5"; sessionStartBtn.disabled = true;
    addMessage("セッション開始！全力で挑め🔥", "system");
  });
}

window.addEventListener('DOMContentLoaded', () => {
  localStorage.setItem("missionsLocked", "false");
  const d = new Date().toISOString().split('T')[0];
  if (startInput) startInput.value = d; if (endInput) endInput.value = d;
  updateDayStatus();
});

if (sendBtn) sendBtn.addEventListener("click", sendMessage);
if (chatInput) chatInput.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });
if (startInput) startInput.addEventListener("change", updateDayStatus);
if (endInput) endInput.addEventListener("change", updateDayStatus);