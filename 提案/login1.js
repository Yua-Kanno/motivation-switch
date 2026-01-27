document.addEventListener('DOMContentLoaded', () => {
    const signupBtn = document.getElementById('signup-btn');
    const usernameInput = document.getElementById('new-username');
    const passwordInput = document.getElementById('new-password');

    signupBtn.addEventListener('click', () => {
        const user = usernameInput.value;
        const pass = passwordInput.value;

        if (user && pass) {
            // 新規ユーザー情報を保存
            localStorage.setItem('motivex_user', user); // login.jsとキーを統一

            alert("アカウントを作成しました！ログイン画面へ移動します。");
            
            // ログイン画面へ戻る
            window.location.href = "login.html";
        } else {
            alert("UsernameとPasswordを決めてください。");
        }
    });
});