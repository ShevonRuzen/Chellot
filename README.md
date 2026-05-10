# 🤖 Chellot - AI Chatbot

<div align="center">
  <img src="icon.jpeg" alt="Chellot Logo" width="80" height="80" style="border-radius: 12px;">
  
  **A Modern, Multi-Model AI Chatbot with Image, Audio & Video Generation**
  
  [![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
  [![Built with](https://img.shields.io/badge/Built%20with-Tailwind%20CSS-38B2AC)](https://tailwindcss.com)
  [![API](https://img.shields.io/badge/API-OpenRouter-FF6B6B)](https://openrouter.ai)

</div>

---

## ✨ Features

### 🎯 Core Capabilities

- **Multi-Model AI Support**: Seamless integration with various AI models for different tasks
- **Text Generation**: Intelligent conversation with advanced language models
- **Image Generation**: Create stunning visuals from text descriptions
- **Audio Generation**: Generate high-quality audio from prompts
- **Video Generation**: Create videos based on AI-generated content

### 🎨 User Experience

- **Multiple Themes**: 5 beautiful themes including Midnight Glass, Aurora, Solar Flare, Arctic Light, and Sakura
- **Glass Morphism UI**: Modern, elegant glass-effect interface with smooth animations
- **Responsive Design**: Fully responsive interface for desktop and mobile devices
- **Chat History**: Automatic saving and organization of conversations
- **Export Functionality**: Download chat conversations for reference

### ⚙️ Advanced Features

- **Model Selection**: Choose different AI models for each task type
- **API Key Management**: Secure local storage of OpenRouter API keys
- **Fallback Models**: Automatic model fallback for better reliability
- **Dark Mode**: Built-in dark theme with customizable colors
- **Code Highlighting**: Syntax highlighting for code snippets in conversations
- **Markdown Support**: Full markdown rendering with HTML sanitization

---

## 🚀 Quick Start

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- OpenRouter API key (get it from [openrouter.ai](https://openrouter.ai))

### Installation

1. **Clone or Download**

   ```bash
   git clone <repository-url>
   cd chat_bot
   ```

2. **Open the Application**
   - Open `index.html` in your web browser
   - Or use a local server:

     ```bash
     # Using Python
     python -m http.server 8000

     # Using Node.js (with http-server)
     npx http-server
     ```

3. **Configure API Key**
   - Click the **Settings** button in the sidebar
   - Enter your OpenRouter API key
   - Settings are saved locally in your browser

---

## 🎯 Usage Guide

### Starting a Conversation

1. Click **"New Chat"** in the sidebar to start a new conversation
2. Type your message in the input field at the bottom
3. Press Enter or click the send button to submit

### Generating Images

Use any of these prompts to generate images:

- "Convert to an image"
- "Edit this picture"
- "Ask for an illustration"
- "Paint me a..."
- "Design a photo"

### Generating Audio

Request audio with prompts like:

- "Convert to mp3"
- "Create audio"
- "Generate sound"
- "Make music"

### Generating Videos

Create videos using prompts like:

- "Convert to video"
- "Create a video"
- "Generate animation"
- "Make a video"

### Customizing Your Experience

1. **Theme Selection**: Go to Settings → Appearance to choose your preferred theme
2. **Model Selection**: Switch between different AI models in Settings → Models & Fallbacks
3. **Manage API Key**: Update your OpenRouter API key in Settings → OpenRouter API Key

### Exporting Chats

- Click the **Download** button in the top bar to export the current chat
- Chats are saved as JSON files for easy importing or sharing

---

## 📋 Available Models

### Text Models

- Nvidia Nemotron 3 120B (Free)
- Owl Alpha
- Poolside Laguna M.1 (Free)
- GPT-OSS 120B (Free)
- And many more...

### Image Models

- Flux.2 Pro & Klein
- Seedream 4.5
- Riverflow V2 Series
- Recraft V3 & V4

### Audio Models

- Lyria 3 Pro Preview
- Lyria 3 Clip Preview

### Video Models

- Kling V3.0 Pro & Std
- Veo 3.1 Fast & Lite
- Hailuo 2.3
- Seedance 2.0 Series

---

## 🎨 Themes

Choose from 5 carefully designed themes:

| Theme              | Description                               |
| ------------------ | ----------------------------------------- |
| **Midnight Glass** | Deep blue with violet accents (Default)   |
| **Aurora**         | Green and cyan gradient with glass effect |
| **Solar Flare**    | Warm orange and red tones                 |
| **Arctic Light**   | Light, clean, minimalist design           |
| **Sakura**         | Pink and purple with elegant styling      |

---

## 💾 Data Storage

All data is stored locally in your browser:

- **API Key**: Encrypted and stored in localStorage
- **Chat History**: Automatically saved for quick access
- **Theme Preference**: Remembered across sessions
- **Model Selections**: Your preferred models are saved

**Note**: Clearing browser cache will delete all saved data.

---

## 🔧 Technical Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Tailwind CSS with custom glass morphism effects
- **API**: OpenRouter AI API
- **Libraries**:
  - Marked.js (Markdown rendering)
  - DOMPurify (HTML sanitization)
  - Highlight.js (Code syntax highlighting)
  - Font Awesome (Icons)

---

## ⚠️ Important Notes

- **API Costs**: Using non-free models may incur charges on your OpenRouter account
- **Rate Limits**: Be aware of OpenRouter's rate limiting policies
- **Data Privacy**: Conversations are stored locally; server-side storage is not implemented
- **Browser Compatibility**: Works best on modern browsers supporting ES6+

---

## 🐛 Troubleshooting

### API Key Issues

- Ensure your API key is valid on [openrouter.ai](https://openrouter.ai)
- Check that your account has sufficient credits
- Try clearing the API key and re-entering it

### Generation Failures

- Check your internet connection
- Verify your API key and account credits
- Try switching to a different model
- Check browser console for detailed error messages

### Performance Issues

- Clear browser cache if experiencing slowdowns
- Close other resource-intensive tabs
- Try refreshing the page

### Local Storage Issues

- Use browser DevTools to check localStorage usage
- Clear unnecessary chat history
- Try using an incognito/private browsing window

---

## 📝 Settings Configuration

### API Key Setup

1. Get your free API key from [openrouter.ai](https://openrouter.ai)
2. Go to Settings → OpenRouter API Key
3. Paste your key (Format: `sk-or-v1-...`)
4. Click "Save Changes"

### Model Configuration

1. Open Settings → Models & Fallbacks
2. Select your preferred model for each task type
3. Click "Save Changes"
4. The new models will be used immediately

---

## 📞 Support

For issues or feature requests, please contact the developer or create an issue in the repository.

---

## 📄 License

This project is provided as-is for educational and personal use.

---

## 👨‍💻 About

**Chellot** is an open-source AI chatbot interface built with modern web technologies. It showcases the power of the OpenRouter API by providing a sleek, user-friendly interface for multi-modal AI interactions.

**Developed by**: Shehan  
**Year**: 2026

---

<div align="center">
  <p>Made with ❤️ by Shehan</p>
  <p>© 2026 All Rights Reserved</p>
</div>
