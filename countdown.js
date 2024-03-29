var x; // カウントダウン用のインターバルを格納する変数
var countDownDate; // カウントダウンの目標日時を格納する変数
var isPaused = false; // カウントダウンが一時停止されているかのフラグ

document.addEventListener('DOMContentLoaded', function() {
    // カウントダウン開始ボタンにクリックイベントリスナーを設定
    document.getElementById('startButton').addEventListener('click', setCountdown);
});

function setCountdown() {
    var title = document.getElementById('countdownTitle').value; // タイトル入力フィールドから値を取得
    var datetimeInput = document.getElementById('datetimeInput').value;
    countDownDate = new Date(datetimeInput).getTime();

    // カウントダウンのタイトルを設定
    document.getElementById('countdownTitleText').textContent = title;

    // 背景GIFを設定
    document.body.style.backgroundImage = "url('pajama.gif')";
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

function updateCountdown() {
    if (x) clearInterval(x);
    x = setInterval(function() {
        var now = new Date().getTime();
        var distance = countDownDate - now;

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("timer").innerHTML = days + "日 " + hours + "時間 " + minutes + "分 " + seconds + "秒 ";

        if (distance < 0) {
            clearInterval(x);
            document.getElementById("timer").innerHTML = "EXPIRED";
        }
    }, 1000);
}

function stopCountdown() {
    if (!isPaused) {
        clearInterval(x);
        document.getElementById('stopButton').innerText = '再開';
        document.getElementById('stopButton').onclick = resumeCountdown;
        isPaused = true;
    }
}

function resumeCountdown() {
    isPaused = false;
    document.getElementById('stopButton').innerText = '停止';
    document.getElementById('stopButton').onclick = stopCountdown;
    updateCountdown();
}

function resetCountdown() {
    var confirmReset = confirm("本当にリセットしますか？");
    if (confirmReset) {
        if (x) clearInterval(x);
        document.getElementById('timer').innerHTML = "";
        document.getElementById('countdownTitleText').textContent = ""; // タイトルテキストをクリア
        document.getElementById('input-container').style.display = 'block';
        document.getElementById('fullscreenButton').style.display = 'none';
        document.getElementById('stopButton').style.display = 'none';
        document.getElementById('resetButton').style.display = 'none';
        document.body.style.backgroundImage = "none"; // 背景を初期状態に戻す
    }
}


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

document.addEventListener('fullscreenchange', function() {
    var isFullscreen = document.fullscreenElement != null;
    document.getElementById('stopButton').style.display = isFullscreen ? 'none' : 'inline';
    document.getElementById('resetButton').style.display = isFullscreen ? 'none' : 'inline';
    document.getElementById('fullscreenButton').style.display = isFullscreen ? 'none' : 'inline';
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('startButton').addEventListener('click', setCountdown);
    
    // リセットボタンのイベントリスナーを設定
    document.getElementById('resetButton').addEventListener('click', resetCountdown);
    
    // フルスクリーンボタンのイベントリスナーを設定
    document.getElementById('fullscreenButton').addEventListener('click', toggleFullscreen);
});

