// login.js

const usernameInput = document.querySelector('input[placeholder="Username"]');
const passwordInput = document.querySelector('input[placeholder="Password"]');
const signInBtn = document.querySelector('.btn-red-signin');
const toSignUpBtn = document.getElementById('to-signup-btn');

// SIGN UP 画面へ移動
if (toSignUpBtn) {
    toSignUpBtn.addEventListener('click', () => {
        window.location.href = "login1.html";
    });
}

// SIGN IN ボタンが押された時の処理
signInBtn.addEventListener('click', () => {
    const inputUser = usernameInput.value;
    const inputPass = passwordInput.value;

    // 1. LocalStorageから登録済みの情報を取得（login1.jsで保存したキー）
    const registeredUser = localStorage.getItem('motivex_user');
    const registeredPass = localStorage.getItem('savedPassword');

    // 2. 入力チェックと照合
    if (!inputUser || !inputPass) {
        alert("UsernameとPasswordを入力してください。");
        return;
    }

    // 3. 登録データが存在し、かつ入力と一致するか確認
    if (inputUser === registeredUser && inputPass === registeredPass) {
        // 一致した場合
        alert(`ACCESS GRANTED\nようこそ ${inputUser} ゲームスタート！！`);
        window.location.href = "index.html"; 
    } else if (!registeredUser) {
        // そもそも一度も登録（SIGN UP）されていない場合
        alert("アカウントが見つかりません。先にSIGN UPしてください。");
    } else {
        // 名前かパスワードが違う場合
        alert("UsernameまたはPasswordが正しくありません。");
    }
});