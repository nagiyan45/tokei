// 全画面表示のトグル機能
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
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
    setTimeout(updateClock, 1000);
}

// ページが読み込まれた後にイベントリスナーを設定
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('fullscreenButton').addEventListener('click', toggleFullscreen);
    updateClock(); // 時計を起動
});
