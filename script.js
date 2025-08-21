/*const speakBtn = document.getElementById('speakBtn');
const weatherDiv = document.getElementById('weather');
const status = document.getElementById('status');

const API_KEY = 'a24239dd0a2ac53440fbb44d3e5118a8';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

let recognizing = false;
let recognition;

if (!SpeechRecognition) {
  speakBtn.disabled = true;
  status.textContent = "❌ Sorry, your browser does not support Speech Recognition.";
}

function stopRecognition() {
  if (recognition && recognizing) {
    recognition.stop();
    recognizing = false;
  }
}

speakBtn.addEventListener('click', () => {
  // Prevent starting multiple recognition sessions
  if (recognizing || !SpeechRecognition) return;

  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = true;
  recognition.maxAlternatives = 3;

  recognizing = true;
  status.textContent = "🎙 Listening...";

  let finalTranscript = '';

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      transcript += event.results[i][0].transcript;
    }

    transcript = transcript.trim().replace(/[^a-zA-Z\s]/g, "");

    if (event.results[event.results.length - 1].isFinal) {
      finalTranscript = transcript;
      status.textContent = `You said: ${finalTranscript}`;
      stopRecognition(); // Stop after final result
      if (finalTranscript) {
        getWeather(finalTranscript);
      } else {
        weatherDiv.innerHTML = "<p>Please say a valid city name.</p>";
      }
    } else {
      status.textContent = `Partial: ${transcript}`;
    }
  };

  recognition.onerror = (event) => {
    status.textContent = "❌ Error: " + event.error;
    stopRecognition();
    if (event.error === "no-speech" || event.error === "audio-capture") {
      weatherDiv.innerHTML = "<p>No speech detected. Please try again.</p>";
    }
  };

  recognition.onnomatch = () => {
    status.textContent = "❌ Didn't recognize a city. Try again.";
    weatherDiv.innerHTML = "<p>Didn't recognize a city. Please try again.</p>";
    stopRecognition();
  };

  recognition.onend = () => {
    recognizing = false;
    // Only show end message if there was no final transcript
    if (!finalTranscript) {
      status.textContent = "🔇 Recognition ended. Click and try again.";
    }
  };

  recognition.start();
});

function getWeather(city) {
  if (!city) {
    weatherDiv.innerHTML = "<p>Please say a valid city name.</p>";
    return;
  }

  weatherDiv.innerHTML = "<p>🔄 Fetching weather...</p>";

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`)
    .then(response => {
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then(data => {
      const { name, main, weather } = data;
      weatherDiv.innerHTML = `
        <h2>📍 ${name}</h2>
        <p>🌡 Temperature: ${main.temp}°C</p>
        <p>☁ Weather: ${weather[0].description}</p>
      `;
      speakWeather(name, main.temp, weather[0].description);
    })
    .catch(() => {
      weatherDiv.innerHTML = "<p>❌ City not found. Try again.</p>";
    });
}

function speakWeather(city, temp, description) {
  if ('speechSynthesis' in window) {
    const speech = new SpeechSynthesisUtterance(
      `The current temperature in ${city} is ${temp} degrees Celsius with ${description}.`
    );
    speech.lang = 'en-US';
    window.speechSynthesis.speak(speech);
  }
}*/
const btn = document.getElementById('speakBtn');
const weatherDiv = document.getElementById('weather');
const status = document.getElementById('status');
const API_KEY = 'a24239dd0a2ac53440fbb44d3e5118a8';

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
        <h2>📍 ${d.name}</h2>
        <p>🌡 ${d.main.temp}°C</p>
        <p>☁ ${d.weather[0].description}</p>`;
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
