var x; // カウントダウン用のインターバルを格納する変数
var countDownDate; // カウントダウンの目標日時を格納する変数
var isPaused = false; // カウントダウンが一時停止されているかのフラグ

// カウントダウンを設定する関数
function setCountdown() {
    var datetimeInput = document.getElementById('datetimeInput').value;
    countDownDate = new Date(datetimeInput).getTime();

    // 背景GIFを設定
    document.body.style.backgroundImage = "url('kauntodaun.gif')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";

    // その他のUI要素の表示を調整
    document.getElementById('input-container').style.display = 'none';
    document.getElementById('fullscreenButton').style.display = 'inline';
    document.getElementById('stopButton').style.display = 'inline';
    document.getElementById('resetButton').style.display = 'inline';
    document.getElementById('stopButton').innerText = '停止';
    document.getElementById('stopButton').onclick = stopCountdown;

    updateCountdown();
}

// カウントダウンを更新する関数
function updateCountdown() {
    if (x) clearInterval(x);
    x = setInterval(function() {
        var now = new Date().getTime();
        var distance = countDownDate - now;

        // 日、時間、分、秒を計算
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // 結果を表示
        document.getElementById("timer").innerHTML = days + "日 " + hours + "時間 " + minutes + "分 " + seconds + "秒 ";

        // カウントダウンが終了したら
        if (distance < 0) {
            clearInterval(x);
            document.getElementById("timer").innerHTML = "EXPIRED";
        }
    }, 1000);
}

// カウントダウンを停止する関数
function stopCountdown() {
    if (!isPaused) {
        clearInterval(x);
        document.getElementById('stopButton').innerText = '再開';
        document.getElementById('stopButton').onclick = resumeCountdown;
        isPaused = true;
    }
}

// カウントダウンを再開する関数
function resumeCountdown() {
    isPaused = false;
    document.getElementById('stopButton').innerText = '停止';
    document.getElementById('stopButton').onclick = stopCountdown;
    updateCountdown();
}

// カウントダウンをリセットする関数
function resetCountdown() {
    var confirmReset = confirm("本当にリセットしますか？");
    if (confirmReset) {
        if (x) clearInterval(x);
        document.getElementById('timer').innerHTML = "";
        document.getElementById('input-container').style.display = 'block';
        document.getElementById('fullscreenButton').style.display = 'none';
        document.getElementById('stopButton').style.display = 'none';
        document.getElementById('resetButton').style.display = 'none';
        // 背景を初期状態に戻す（オプション）
        document.body.style.backgroundImage = "none";
    }
}

// 全画面表示の切り替え関数
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            alert(`エラーが発生しました: ${err.message} (${err.name})`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// 全画面表示状態の変更を検知してボタンの表示を制御
document.addEventListener('fullscreenchange', function() {
    var isFullscreen = document.fullscreenElement != null;
    document.getElementById('stopButton').style.display = isFullscreen ? 'none' : 'inline';
    document.getElementById('resetButton').style.display = isFullscreen ? 'none' : 'inline';
    document.getElementById('fullscreenButton').style.display = isFullscreen ? 'none' : 'inline';
});
