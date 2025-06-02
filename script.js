// ======== Oz English Buddy – Main Script =========
// Author: ITA11 project – ChatGPT helper
// Description: Aussie-slang conversion via Ollama + speech + volatile History
// Updated: 2025-05-15 – added getPromptByLevel() to diversify Beginner/Intermediate/Advanced output

/* -------------------------------------------------- */
/*               Element References                   */
/* -------------------------------------------------- */
const inputText       = document.getElementById('inputText');
const convertBtn      = document.getElementById('convertBtn');
const originalOutput  = document.getElementById('originalOutput');
const slangOutput     = document.getElementById('slangOutput');
const outputArea      = document.getElementById('outputArea');

const readOriginalBtn = document.getElementById('readOriginalBtn');
const readSlangBtn    = document.getElementById('readSlangBtn');
const readAmericanBtn = document.getElementById('readAmericanBtn');

const rateRange       = document.getElementById('rateRange');
const rateValue       = document.getElementById('rateValue');
const slangLevel      = document.getElementById('slangLevel');

const historyList     = document.getElementById('historyList');

/* -------------------------------------------------- */
/*                 Config – Ollama                    */
/* -------------------------------------------------- */
const OLLAMA_ENDPOINT = 'http://localhost:11434/api/generate';
const OLLAMA_MODEL    = 'mistral';

/* -------------------------------------------------- */
/*               History  (session only)              */
/* -------------------------------------------------- */
let history = [];

function renderHistory() {
  if (!historyList) return;
  historyList.innerHTML = '';

  const labelMap = {
    beginner: '🟢 Mild',
    intermediate: '🟡 Moderate',
    advanced: '🔴 Strong'
  };

  history.slice().reverse().forEach(item => {
    const entry = document.createElement('div');
    entry.className = 'history-entry';
    entry.innerHTML = `
      <div><strong>${labelMap[item.level] || item.level}</strong></div>
      <div><strong>Original:</strong> ${item.original}</div>
      <div><strong>Slang:</strong> ${item.slang}</div>
    `;
    historyList.appendChild(entry);
  });
}

renderHistory();

/* -------------------------------------------------- */
/*        Reading-speed slider live label update       */
/* -------------------------------------------------- */
rateRange.addEventListener('input', () => {
  rateValue.textContent = rateRange.value;
});

/* -------------------------------------------------- */
/*                Speech Synthesis Utils              */
/* -------------------------------------------------- */
let voices = [];

speechSynthesis.onvoiceschanged = () => {
  voices = speechSynthesis.getVoices();
  const prewarm = new SpeechSynthesisUtterance(' ');
  speechSynthesis.speak(prewarm);
};

function getVoiceByAccent(accentCode) {
  return voices.find(v => v.lang === accentCode) || voices[0];
}

function speakText(text, accentCode) {
  if (!text) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = getVoiceByAccent(accentCode);
  utterance.rate  = parseFloat(rateRange.value);
  speechSynthesis.speak(utterance);
}

/* -------------------------------------------------- */
/*     Slang‑level‑specific Prompt Generator          */
/* -------------------------------------------------- */
function getPromptByLevel(level, text) {
  let instruction = '';

  switch (level) {
    case 'Mild':
      instruction = 'Rewrite using very basic Australian slang that is easy to understand. Avoid complex expressions or idioms.';
      break;
    case 'Moderate':
      instruction = 'Rewrite using everyday Australian slang as used by locals in informal conversation. Make it sound natural and fluent.';
      break;
    case 'Strong':
      instruction = 'Rewrite using rich and authentic Australian slang, including idioms, abbreviations, and expressions common among native speakers.';
      break;
    default:
      instruction = 'Rewrite using common Australian slang.';
  }

  return `${instruction}\n\nOnly output the rewritten sentence. Output ONLY the rewritten sentence - no explanations or parentheses. \nCorrect grammar and natural wording are required.\n\nSentence: "${text}"`;
}


/* -------------------------------------------------- */
/*               Conversion  (main flow)              */
/* -------------------------------------------------- */
async function convertTextOnly() {
  const text = inputText.value.trim();
  if (!text) {
    alert('Enter some text first, mate!');
    return;
  }

  convertBtn.disabled = true;
  convertBtn.textContent = 'Working';
  convertBtn.classList.add('working-animation');



  try {
    const slangified = await toAussieSlang(text, slangLevel.value);

    originalOutput.textContent = text;
    slangOutput.textContent    = slangified;
    outputArea.style.display   = 'block';
    outputArea.scrollIntoView({ behavior: 'smooth', block: 'start' });

    history.push({ original: text, slang: slangified, level: slangLevel.value });
    renderHistory();

  } catch (err) {
    slangOutput.textContent = `Error: ${err.message}`;
    console.error(err);
  } finally {
    convertBtn.disabled = false;
    convertBtn.textContent = 'Give it an Aussie spin';
    convertBtn.classList.remove('working-animation');
  }
}

/* -------------------------------------------------- */
/*                Ollama REST integration             */
/* -------------------------------------------------- */
async function toAussieSlang(text, level) {
  const prompt = getPromptByLevel(level, text);
  const body   = { model: OLLAMA_MODEL, prompt, stream: false };

  const res = await fetch(OLLAMA_ENDPOINT, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify(body)
  });

  if (!res.ok) throw new Error(`Ollama request failed (${res.status})`);
  const data = await res.json();
  if (!data.response) throw new Error('No response field from Ollama');
  return data.response.trim();
}

/* -------------------------------------------------- */
/*                    Event Bindings                  */
/* -------------------------------------------------- */
convertBtn.addEventListener('click', convertTextOnly);
readOriginalBtn.addEventListener('click', () => speakText(originalOutput.textContent.trim(), 'en-AU'));
readSlangBtn.addEventListener('click',    () => speakText(slangOutput.textContent.trim(),  'en-AU'));
readAmericanBtn.addEventListener('click', () => speakText(originalOutput.textContent.trim(), 'en-US'));

window.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('welcomeOverlay');
  if (overlay) setTimeout(() => overlay.remove(), 4000);
});
