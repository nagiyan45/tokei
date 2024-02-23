document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // フォームのデフォルト送信動作を防止

    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // 特定のユーザー名とパスワードをチェック
    if (username === "110higashiurawa" && password === "11541154g") {
        window.location.href = 'countdown.html'; // リダイレクト先のページ
    } else {
        alert('ユーザー名またはパスワードが間違っています。');
    }
});
