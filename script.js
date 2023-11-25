function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    document.getElementById('fullscreenButton').classList.add('hidden'); // フルスクリーン時にボタンを隠す
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      document.getElementById('fullscreenButton').classList.remove('hidden'); // フルスクリーン解除時にボタンを表示
    }
  }
}

document.addEventListener('fullscreenchange', (event) => {
  // フルスクリーンが解除されたときにボタンを表示する
  if (!document.fullscreenElement) {
    document.getElementById('fullscreenButton').classList.remove('hidden');
  }
});

// 時計の文字色を更新する機能
function updateClockColor() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var clockElement = document.getElementById('clock');

    if (hours >= 22 && minutes >= 30 || hours < 7) {
        clockElement.style.color = 'red'; // 22:30を過ぎたら、または7:00前なら赤色に
    } else {
        clockElement.style.color = 'yellow'; // それ以外の時間は黄色に
    }
}
// 時計を更新する機能
function updateClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    document.getElementById('clock').innerHTML = hours + ':' + minutes + ':' + seconds;
    updateClockColor(); // 時計の文字色を更新
    setTimeout(updateClock, 1000);
}

// ページが読み込まれた後にイベントリスナーを設定
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('fullscreenButton').addEventListener('click', toggleFullscreen);
    updateClock(); // 時計を起動
});
