// ==============================
// Motivex Home Script (修正版)
// ==============================

document.addEventListener("DOMContentLoaded", () => {

  // ==============================
  // モード説明データ
  // ==============================
  const modeData = {
    normal: {
      title: "NORMAL MODE",
      text: "普段使いに最適なフォーカスモード。安定した集中を保ち、長時間の作業や学習に向いています。"
    },
    boost: {
      title: "BOOST MODE",
      text: "やる気が出ない時のための起動モード。短時間で一気に集中を加速します🔥"
    },
    ignition: {
      title: "IGNITION MODE",
      text: "ガチで集中したい時の最終モード。覚悟を決めて起動するMotivexの最終兵器です🗡️"
    }
  };

  // ==============================
  // 要素取得
  // ==============================
  const modeButtons = document.querySelectorAll(".mode");
  const infoTitle = document.getElementById("infoTitle");
  const infoText = document.getElementById("infoText");
  const playBtn = document.querySelector(".play-btn");

  // 要素が存在するかチェック（エラー防止）
  if (!infoTitle || !infoText || !playBtn) {
    console.error("必要なHTML要素が見つかりません。IDやクラス名を確認してください。");
    return;
  }

  // ==============================
  // モード選択処理
  // ==============================
  modeButtons.forEach(button => {
    button.addEventListener("click", () => {
      const modeKey = button.dataset.mode;

      // データが存在するかチェック
      if (modeData[modeKey]) {
        // 説明パネル更新
        infoTitle.textContent = modeData[modeKey].title;
        infoText.textContent = modeData[modeKey].text;

        // 見た目の active 切り替え
        modeButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        
        // localStorageに即時保存（念のため）
        localStorage.setItem('selectedMotivexMode', modeKey);
      }
    });
  });

  // ==============================
  // PLAYボタン処理
  // ==============================
  playBtn.addEventListener("click", (e) => {
    e.preventDefault(); // ボタンのデフォルト挙動を防止

    const activeBtn = document.querySelector('.mode.active');
    
    if (!activeBtn) {
      alert("モードを選択してください！");
      return;
    }

    const selectedMode = activeBtn.getAttribute('data-mode');

    // 最終的な遷移先判定
    if (selectedMode === 'boost') {
      window.location.href = 'index2.html';
    } else if (selectedMode === 'ignition') {
      window.location.href = 'index3.html';
    } else {
      window.location.href = 'index1.html';
    }
  });

});