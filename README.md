# Technology-enhanced-Language-Learning

# 🇦🇺 Oz English Buddy

**Oz English Buddy** is a web-based educational tool that transforms standard English sentences into authentic Australian slang. Whether you're a beginner or a slang-savvy learner, this tool helps you explore the richness of Aussie English with adjustable levels and speech synthesis.

---

## Features

- Convert input text into Australian slang (Beginner / Intermediate / Advanced)
- Listen to both original and slang versions with speech synthesis
- Supports Australian and American English accents
- Displays a session-based history of conversions
- Clean and modern UI with Aussie-themed styling

---

## Technologies

- HTML, CSS, JavaScript
- [SpeechSynthesis API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
- Local integration with [Ollama](https://ollama.com/) for text generation (model: `mistral`)

> **Note**: The tool sends prompts to a local Ollama instance at `http://localhost:11434/api/generate`.

---

## How to Use

1. Open `index.html` in your browser
2. Enter a sentence in English
3. Choose a slang level:
   - 🟢 Mild: Basic, easy-to-understand slang
   - 🟡 Moderate: Everyday Australian expressions
   - 🔴 Strong: Rich slang with idioms and abbreviations
4. Click **"Give it an Aussie spin"**
5. Read or listen to the result!
