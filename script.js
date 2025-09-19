const btn = document.getElementById('speakBtn');
const weatherDiv = document.getElementById('weather');
const status = document.getElementById('status');
const API_KEY = 'a24239dd0a2ac53440fbb44d3e5118a8';
const backgrounds = {
  Clear: "url('https://i2-prod.irishmirror.ie/incoming/article32639906.ece/ALTERNATES/s810/1_Ireland-sunshine-field.jpg')",
  Clouds: "url('https://images.unsplash.com/photo-1611928482473-7b27d24eab80?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
  Rain: "url('https://greaterkashmir.imagibyte.sortdcdn.net/wp-content/uploads/2025/06/Screenshot-2025-06-29-at-11.14.02-PM.png?type=webp&quality=80&size=800')",
  Snow: "url('https://media.istockphoto.com/id/166018394/photo/bare-trees-in-a-forest-in-sunny-winter.jpg?s=2048x2048&w=is&k=20&c=ZCB_ZT2tDc9mK7yJe2LeSMKW3bZ_N8y_T3TGr9IBNK4=')",
  Thunderstorm: "url('https://living.geico.com/wp-content/uploads/geico-more-Thunderstorms-post-2016.jpg')",
  Mist: "url('https://c4.wallpaperflare.com/wallpaper/1010/649/150/best-foggy-weather-in-sunset-time-wallpaper-preview.jpg')",
  Night: "url('https://omag.b-cdn.net/wp-content/uploads/2022/07/22_0801_DISCIPLESHIP_6-Ways-I-Deal-with-Dark-Nights-of-the-Soul_1021x640.jpg')",
  Haze:"url('https://cff2.earth.com/uploads/2018/11/13015448/what-is-haze-960x640.jpg')"
  //Broken Clouds:"url('https://www.flickr.com/images/opensearch-flickr-logo.png')"
};


const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (!SR) {
  btn.disabled = true;
  status.textContent = "❌ Speech Recognition not supported.";
}

btn.addEventListener('click', () => {
  if (recognition) return;

  recognition = new SR();
  recognition.lang = 'en-US';
  recognition.maxAlternatives = 3;
  status.textContent = "🎙 Listening...";

  recognition.onresult = e => {
    let results = e.results[e.results.length - 1];
    let guesses = [...results].map(r => r.transcript.trim());
    status.textContent = "You said: " + guesses.join(", ");
    recognition.stop();

    if (results.isFinal && guesses[0]) getWeather(guesses[0]);
  };

  recognition.onerror = () => status.textContent = "❌ Try again.";
  recognition.onend = () => recognition = null;
  recognition.start();
});

function getWeather(city) {
  weatherDiv.innerHTML = "🔄 Fetching weather...";
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(d => {
      weatherDiv.innerHTML = `
        <h2>${d.name}</h2>
        <p>${d.main.temp}°C</p>
        <p>${d.weather[0].description}</p>`;
        let condition = d.weather[0].main;
      document.body.style.backgroundImage = backgrounds[condition] || backgrounds.Clear;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";

      speakWeather(d.name, d.main.temp, d.weather[0].description);
    })
    .catch(() => weatherDiv.innerHTML = "❌ City not found.");
}

function speakWeather(city, temp, desc) {
  if ('speechSynthesis' in window) {
    let msg = new SpeechSynthesisUtterance(
      `The current temperature in ${city} is ${temp} degrees Celsius with ${desc}.`
    );
    window.speechSynthesis.speak(msg);
  }
}

