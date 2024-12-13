const API_BASE_URL = "https://www.jma.go.jp/bosai/forecast/data/forecast/";

const forecastContainer = document.querySelector(".forecast-container");

const locationElement = document.getElementById("location");

const breadcrumbItems = document.querySelectorAll(".breadcrumb li");



// 初期設定: 東京（130000）

let currentPrefCode = "130000";



// 天気予報を取得して表示

async function fetchWeather(prefCode) {

  const response = await fetch(`${API_BASE_URL}${prefCode}.json`);

  const data = await response.json();



  // 地域名を取得

  const areaName = data[0].timeSeries[0].areas[0].area.name;

  locationElement.textContent = areaName;



  // 天気データを取得

  const dailyForecasts = data[0].timeSeries[0].areas[0];

  const temps = data[0].timeSeries[2].areas[0].temps || [];

  const rainChances = data[0].timeSeries[1].areas[0].pops || [];



  // 「今日」「明日」「明後日」のデータを表示

  const days = ["今日", "明日"];

  forecastContainer.innerHTML = ""; // コンテナをリセット



  for (let i = 0; i < 3; i++) {

    // データの存在を確認

    const weather = dailyForecasts.weathers[i] || "データなし";

    const tempHigh = temps[i * 2] || "--";

    const tempLow = temps[i * 2 + 1] || "--";

    const rainChance = rainChances[i] || "--";



    const forecastHTML = `

      <div class="forecast-day">

        <h3>${days[i]}</h3>

        <img src="https://via.placeholder.com/50" alt="天気アイコン" class="weather-icon">

        <div class="temperature">最高: ${tempHigh}℃</div>

        <div class="temperature">最低: ${tempLow}℃</div>

        <div class="rain-chance">降水確率: ${rainChance}%</div>

      </div>

    `;

    forecastContainer.innerHTML += forecastHTML;

  }

}



// パンくずリストの切り替え

breadcrumbItems.forEach(item => {

  item.addEventListener("click", () => {

    // 現在の選択を更新

    breadcrumbItems.forEach(el => el.classList.remove("active"));

    item.classList.add("active");



    // 選択した都道府県コードで天気を更新

    currentPrefCode = item.dataset.pref;

    fetchWeather(currentPrefCode);

  });

});



// 初期データの読み込み

fetchWeather(currentPrefCode);