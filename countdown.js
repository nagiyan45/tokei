var x; // カウントダウン用のインターバルを格納する変数
var countDownDate; // カウントダウンの目標日時を格納する変数
var isPaused = false; // カウントダウンが一時停止されているかのフラグ

function setCountdown() {
    var title = document.getElementById('countdownTitle').value; // タイトル入力フィールドから値を取得
    var datetimeInput = document.getElementById('datetimeInput').value;
    if (!datetimeInput) {
        alert("日時を入力してください。");
        return;
    }
    countDownDate = new Date(datetimeInput).getTime();

    // カウントダウンのタイトルを設定
    document.getElementById('countdownTitleText').textContent = title;

    // 背景の基本スタイル
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

    // ★ 追加：開始時に天気背景の更新を開始
    window.__weather?.startWeather();

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
        // ★ 追加：天気更新を停止
        window.__weather?.stopWeather();

        if (x) clearInterval(x);
        document.getElementById('timer').innerHTML = "";
        document.getElementById('countdownTitleText').textContent = ""; // タイトルテキストをクリア
        document.getElementById('input-container').style.display = 'block';
        document.getElementById('fullscreenButton').style.display = 'none';
        document.getElementById('stopButton').style.display = 'none';
        document.getElementById('resetButton').style.display = 'none';

        // ★ 変更：完全な none ではなく、仮背景に戻す（存在する画像名に合わせてね）
        document.body.style.backgroundImage = 'url("./start_setUp.jpg")';
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";

        // 状態初期化
        isPaused = false;
        x = null;
        countDownDate = null;
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
    document.getElementById('resetButton').addEventListener('click', resetCountdown);
    document.getElementById('fullscreenButton').addEventListener('click', toggleFullscreen);

    // 初期表示の仮背景（任意）
    document.body.style.backgroundImage = 'url("./start_setUp.jpg")';
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
});

/* ======== 野田市の天気で背景を自動切替（Open-Meteo使用） ======== */
(() => {
  const LAT = 35.957;
  const LON = 139.867;
  const POLL_MS = 10 * 60 * 1000;
  const ASSETS = "./";

  const API = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code&forecast_days=1&timezone=Asia%2FTokyo`;

  function classifyWeather(code){
    if (code === 0) return "clear";
    if ([1,2,3].includes(code)) return "cloudy";
    if ([45,48].includes(code)) return "fog";
    if ([51,53,55,56,57].includes(code)) return "drizzle";
    if ([61,63,65,66,67,80,81,82].includes(code)) return "rain";
    if ([71,73,75,77,85,86].includes(code)) return "snow";
    if ([95,96,99].includes(code)) return "thunder";
    return "cloudy";
  }

  function pickBackground(tag){
    const hour = new Date().getHours();
    const isNight = (hour >= 18 || hour < 5);
    const suffix = isNight ? "_night" : "_day";
    const map = {
      clear:    `clear${suffix}.jpg`,
      cloudy:   `cloudy${suffix}.jpg`,
      fog:      `fog${suffix}.jpg`,
      drizzle:  `drizzle${suffix}.jpg`,
      rain:     `rain${suffix}.gif`,
      snow:     `snow${suffix}.jpg`,
      thunder:  `thunder${suffix}.jpg`,
    };
    return map[tag] || map.cloudy;
  }

  function setBackground(imageFile){
    const full = `${ASSETS}${imageFile}`;
    const img = new Image();
    img.onload = () => {
      document.body.style.backgroundImage = `url("${full}")`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundRepeat = "no-repeat";
      console.log("[BG] loaded:", full);
    };
    img.onerror = () => console.warn("[BG] failed:", full);
    img.src = full + `?v=${Date.now()}`; // キャッシュ回避
  }

  async function fetchAndApplyWeather(){
    try{
      const res = await fetch(API, { cache: "no-store" });
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const code =
        data?.current?.weather_code ??
        data?.current_weather?.weathercode ?? null;
      if (code == null) return;
      const tag = classifyWeather(code);
      const bg = pickBackground(tag);
      console.log("[Weather]", { code, tag, bg });
      setBackground(bg);
    }catch(e){
      console.warn("[Weather] fetch failed:", e);
      // フォールバック（失敗時に見栄えを保つ）
      setBackground("cloudy_day.jpg");
    }
  }

  // 開始・停止API
  let weatherTimerId = null;
  function startWeather(){
    stopWeather();                // 多重起動防止
    fetchAndApplyWeather();       // まず即時適用
    weatherTimerId = setInterval(fetchAndApplyWeather, POLL_MS);
  }
  function stopWeather(){
    if (weatherTimerId) {
      clearInterval(weatherTimerId);
      weatherTimerId = null;
    }
  }

  // グローバルに公開（カウントダウン側から呼ぶ）
  window.__weather = { startWeather, stopWeather };
})();



