var x; // カウントダウン用のインターバルを格納する変数
var countDownDate; // カウントダウンの目標日時を格納する変数
var isPaused = false; // カウントダウンが一時停止されているかのフラグ

/*document.addEventListener('DOMContentLoaded', function() {
    // カウントダウン開始ボタンにクリックイベントリスナーを設定
    document.getElementById('startButton').addEventListener('click', setCountdown);
});*/

function setCountdown() {
    var title = document.getElementById('countdownTitle').value; // タイトル入力フィールドから値を取得
    var datetimeInput = document.getElementById('datetimeInput').value;
    countDownDate = new Date(datetimeInput).getTime();

    // カウントダウンのタイトルを設定
    document.getElementById('countdownTitleText').textContent = title;

    // 背景GIFを設定
    //document.body.style.backgroundImage = "url('pajama.gif')";
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

/* ======== 野田市の天気で背景を自動切替（Open-Meteo使用） ======== */
/* APIキー不要・CORS対応。GitHub Pagesからfetch可能。 */

(() => {
  // ▼設定
  const LAT = 35.957;        // 野田市あたり
  const LON = 139.867;
  const POLL_MS = 10 * 60 * 1000; // 10分ごとに更新
  const ASSETS = "./assets/"; // 画像を置くフォルダ（リポジトリ直下に /assets を作成）

  // Open-Meteo: 天気コードと現在気温を取得
  const API = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code&forecast_days=1&timezone=Asia%2FTokyo`;

  // 天気コードを背景タグに分類
  function classifyWeather(code){
    if (code === 0) return "clear";                 // 快晴
    if ([1,2,3].includes(code)) return "cloudy";    // 晴れ/くもり
    if ([45,48].includes(code)) return "fog";       // 霧
    if ([51,53,55,56,57].includes(code)) return "drizzle"; // 霧雨
    if ([61,63,65,66,67,80,81,82].includes(code)) return "rain"; // 雨
    if ([71,73,75,77,85,86].includes(code)) return "snow"; // 雪
    if ([95,96,99].includes(code)) return "thunder"; // 雷雨
    return "cloudy";
  }

  // タグ→ファイル名（_day/_nightを自動出し分け）
  function pickBackground(tag){
    const hour = new Date().getHours();
    const isNight = (hour >= 18 || hour < 5);
    const suffix = isNight ? "_night" : "_day";
    const map = {
      clear:    `clear${suffix}.jpg`,
      cloudy:   `cloudy${suffix}.jpg`,
      fog:      `fog${suffix}.jpg`,
      drizzle:  `drizzle${suffix}.jpg`,
      rain:     `rain${suffix}.jpg`,
      snow:     `snow${suffix}.jpg`,
      thunder:  `thunder${suffix}.jpg`,
    };
    return map[tag] || map["cloudy"];
  }

  // 背景切替（チラつき防止のためプリロード）
  function setBackground(imageFile){
    const url = `url("${ASSETS}${imageFile}")`;
    const img = new Image();
    img.onload = () => {
      document.body.style.backgroundImage = url;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundRepeat = "no-repeat";
      // 既存コードのレイアウトに合わせて他は変更なし
    };
    img.src = `${ASSETS}${imageFile}`;
  }

  // 取得＆適用
  async function fetchAndApplyWeather(){
    try{
      const res = await fetch(API, { cache: "no-store" });
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const code = data?.current?.weather_code;
      const tag = classifyWeather(code);
      const bg = pickBackground(tag);
      setBackground(bg);
      // 任意：画面上に表示したい場合は、要素を作ってテキストを入れる処理を追加可能
      // console.log(`野田市の現在：${tag} (code:${code})`);
    }catch(e){
      // ネットワーク失敗時は何もしない（直前の背景を維持）
      // console.error(e);
    }
  }

  // 初期化：ページ読み込み時に即反映、以後定期更新
  document.addEventListener('DOMContentLoaded', () => {
    // 「pajama.gif」を最初の仮背景にしたい場合は既存コードのままでOK。
    // この関数が成功すると自動で天気背景に上書きされます。
    fetchAndApplyWeather();
    setInterval(fetchAndApplyWeather, POLL_MS);
  });
})();




