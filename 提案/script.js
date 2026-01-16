// 画面の読み込みが終わってから実行する
document.addEventListener('DOMContentLoaded', () => {
  
  // 1. 各モードの説明データ
  const modeData = {
    normal: {
      title: "NORMAL MODE",
      text: "\n普段使いに最適なフォーカスモードになっています。安定した集中を保ち、長時間の作業や学習に向いています。"
    },
    boost: {
      title: "BOOST MODE",
      text: "\nやる気が出ない時のための起動モードになっています。集中スイッチをONにして、短時間で一気に加速します🔥"
      
    },
    ignition: {
      title: "IGNITION MODE",
      text: "\nガチで集中したい時の最終モードになっています。覚悟を決めて起動する、Motivexの最終兵器です🗡️"
    }
  };

  // 2. HTML要素を取得
  const modeButtons = document.querySelectorAll('.mode');
  const infoTitle = document.getElementById('infoTitle');
  const infoText = document.getElementById('infoText');

  // 3. 各ボタンにクリックイベントを登録
  modeButtons.forEach(button => {
    button.addEventListener('click', () => {
      // data-mode属性の値を取得
      const modeKey = button.getAttribute('data-mode');

      if (modeData[modeKey]) {
        // テキストの更新
        infoTitle.innerText = modeData[modeKey].title;
        infoText.innerText = modeData[modeKey].text;

        // 選択中クラスの付け替え
        modeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
      }
    });
  });
});