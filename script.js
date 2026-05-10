/* --- CONFIGURATION & STATE --- */
const DEFAULT_API_KEY = "YOUR_OPENROUTER_API_KEY_HERE"; // Replace with your API key from https://openrouter.ai
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

let state = {
  apiKey: localStorage.getItem("chellot_api_key") || DEFAULT_API_KEY,
  theme: localStorage.getItem("chellot_theme") || "midnight_glass",
  answerMode: localStorage.getItem("chellot_answer_mode") || "simple",
  models: {
    text:
      localStorage.getItem("chellot_model_text") ||
      "nvidia/nemotron-3-super-120b-a12b:free",
    image:
      localStorage.getItem("chellot_model_image") ||
      "bytedance-seed/seedream-4.5",
    audio:
      localStorage.getItem("chellot_model_audio") ||
      "google/lyria-3-pro-preview",
    video: localStorage.getItem("chellot_model_video") || "google/veo-3.1-fast",
  },
  chats: JSON.parse(localStorage.getItem("chellot_chats")) || [],
  currentChatId: null,
  isGenerating: false,
  currentAttachedMedia: [],
};

let abortController = null;

// Fallback lists
const MODEL_LISTS = {
  text: [
    "nvidia/nemotron-3-super-120b-a12b:free",
    "openrouter/owl-alpha",
    "poolside/laguna-m.1:free",
    "openai/gpt-oss-120b:free",
    "inclusionai/ring-2.6-1t:free",
    "z-ai/glm-4.5-air:free",
    "minimax/minimax-m2.5:free",
    "google/gemma-4-31b-it:free",
    "baidu/cobuddy:free",
    "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
    "nvidia/nemotron-3-nano-30b-a3b:free",
    "google/lyria-3-pro-preview",
    "google/lyria-3-clip-preview",
    "nousresearch/hermes-3-llama-3.1-405b:free",
    "meta-llama/llama-3.2-3b-instruct:free",
  ],
  image: [
    "nvidia/llama-nemotron-embed-vl-1b-v2:free",
    "bytedance-seed/seedream-4.5",
    "sourceful/riverflow-v2-fast",
    "black-forest-labs/flux.2-pro",
    "black-forest-labs/flux.2-klein-4b",
    "sourceful/riverflow-v2-pro",
    "sourceful/riverflow-v2-standard-preview",
    "sourceful/riverflow-v2-fast-preview",
    "recraft/recraft-v4-pro",
    "recraft/recraft-v4",
    "sourceful/riverflow-v2-max-preview",
    "recraft/recraft-v3",
  ],
  audio: ["google/lyria-3-pro-preview", "google/lyria-3-clip-preview"],
  video: [
    "kwaivgi/kling-v3.0-pro",
    "kwaivgi/kling-v3.0-std",
    "google/veo-3.1-fast",
    "google/veo-3.1-lite",
    "kwaivgi/kling-video-o1",
    "minimax/hailuo-2.3",
    "bytedance/seedance-2.0",
    "bytedance/seedance-2.0-fast",
    "alibaba/wan-2.7",
    "alibaba/wan-2.6",
  ],
};

/* --- INITIALIZATION --- */
document.addEventListener("DOMContentLoaded", () => {
  setTheme(state.theme);
  setAnswerMode(state.answerMode);

  // Populate settings inputs
  document.getElementById("api-key-input").value = state.apiKey;
  document.getElementById("model-text").value = state.models.text;
  document.getElementById("model-image").value = state.models.image;
  document.getElementById("model-audio").value = state.models.audio;
  document.getElementById("model-video").value = state.models.video;

  // Seed Instructions Chat if it doesn't exist
  if (!state.chats.some((c) => c.id === "instructions_chat")) {
    const instructionsTimestamp = Date.now();
    state.chats.push({
      id: "instructions_chat",
      title: "Welcome & Instructions",
      timestamp: instructionsTimestamp,
      pinned: true,
      messages: [
        {
          role: "ai",
          timestamp: instructionsTimestamp + 1, // Ensure unique timestamp
          content:
            '### Welcome to Chellot – Your Advanced Multi-Modal AI Assistant! 🎉\n\nI am equipped with a **supercharged intent engine** that automatically understands your goals. You no longer need to manually click dropdown menus or configure settings—I will seamlessly route your requests to the best specialized AI models running in the background.\n\nBelow is a detailed guide on how to maximize our interactions:\n\n---\n\n#### 1. 🧠 Smart Auto-Routing (The Intent Engine)\nWhen you type, I actively analyze your words. If you request a standard conversation, I use top-tier Text Models. If you want multimedia, I instantly switch to Image, Audio, or Video models.\n\nHere are the conversational patterns that trigger my advanced capabilities:\n\n**📸 For Images:**\n- *"Convert to an image"*\n- *"Edit this picture"*\n- *"Ask for an illustration"*\n- *"Paint me a..."*\n- *"Design a photo"*\n\n**🎵 For Audio:**\n- *"Convert to mp3"*\n- *"Generate a sound"*\n- *"Make a voice for this text"*\n- *"Compose a song"*\n- *"Sing this track"*\n\n**🎬 For Video:**\n- *"Animate this clip"*\n- *"Convert to mp4"*\n- *"Edit a movie"*\n- *"Ask for a video generation"*\n\n*Just type naturally! As long as you combine an action word (generate, edit, convert, ask for, paint, compose) with a media type (mp3, sound, video, mp4, photo, picture, track), I will handle the technical routing automatically.*\n\n---\n\n#### 2. 🛡️ The Fallback Engine\nAPI models can sometimes be busy or go offline. You don\'t need to worry! If your requested model fails, my **Smart Fallback Engine** will instantly cycle through a backup list of premium models until your request succeeds. \n- *Bonus:* If a fallback model works, I will remember it and use it as your new default for that category!\n\n---\n\n#### 3. 📎 Attaching Files & Multimodal Vision\nNeed me to look at something?\n- Click the **Paperclip Icon (📎)** in the input box to upload images from your device.\n- You can upload multiple images at once.\n- Once attached, simply type *"Describe this image"* or *"What\'s in these photos?"* and hit send. I will process the visual data and provide insights.\n\n---\n\n#### 4. 📌 Organizing Your Workspace\n- **Pin Chats:** Hover over any chat in your sidebar history and click the **Thumbtack (📌)** to pin it permanently to the top of your list under "Pinned".\n- **Delete Chats:** Click the Trash Can (🗑️) to delete old, unneeded conversations.\n\n---\n\n#### 5. ⚙️ Detailed vs. Simple Mode\nAt the bottom of your chat input, you can toggle my personality:\n- **Simple Mode:** I will provide ultra-concise, direct answers (max 5 lines/80 words).\n- **Detailed Mode:** I will provide comprehensive, in-depth explanations with code blocks, structured markdown, and deep context.\n\n---\n\n#### 6. 🎨 Customizing Themes\nClick the **Settings (⚙️)** gear in the top right to access the Theme Hub. You can switch my aesthetics to match your mood:\n- *Midnight Glass (Default)*\n- *Aurora (Green hues)*\n- *Solar Flare (Crimson/Orange)*\n- *Arctic Light (Ice Blue)*\n- *Sakura (Soft Pink)*\n\n*Enjoy exploring the limitless possibilities! Just type below to begin.*',
        },
      ],
    });
    localStorage.setItem("chellot_chats", JSON.stringify(state.chats));
  }

  updateModelBadge();
  renderHistory();

  if (state.chats.length > 0) {
    // Find first pinned chat or fallback to first chat
    const firstChat = state.chats.find((c) => c.pinned) || state.chats[0];
    loadChat(firstChat.id);
  }

  // Input auto-resize and shortcuts
  const input = document.getElementById("message-input");
  input.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!state.isGenerating) sendMessage();
    }
  });

  // Scroll listener for floating "scroll to bottom" button
  const feed = document.getElementById("chat-feed");
  const scrollBtn = document.getElementById("scroll-bottom-btn");
  feed.addEventListener("scroll", () => {
    // If not at bottom, show button
    if (feed.scrollHeight - feed.scrollTop - feed.clientHeight > 100) {
      scrollBtn.classList.remove("hidden");
    } else {
      scrollBtn.classList.add("hidden");
    }
  });

  // Configure Marked.js
  marked.setOptions({
    highlight: function (code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
    langPrefix: "hljs language-",
    breaks: true,
  });
});

/* --- UI FUNCTIONS --- */
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");

  if (window.innerWidth < 768) {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("open");
  } else {
    sidebar.classList.toggle("collapsed");
  }
}

function openSettings() {
  document.getElementById("settings-modal").classList.remove("hidden");
  document.getElementById("settings-modal").classList.add("flex");
}

function closeSettings() {
  document.getElementById("settings-modal").classList.add("hidden");
  document.getElementById("settings-modal").classList.remove("flex");
}

function saveSettings() {
  state.apiKey =
    document.getElementById("api-key-input").value || DEFAULT_API_KEY;
  state.models.text = document.getElementById("model-text").value;
  state.models.image = document.getElementById("model-image").value;
  state.models.audio = document.getElementById("model-audio").value;
  state.models.video = document.getElementById("model-video").value;

  localStorage.setItem("chellot_api_key", state.apiKey);
  localStorage.setItem("chellot_model_text", state.models.text);
  localStorage.setItem("chellot_model_image", state.models.image);
  localStorage.setItem("chellot_model_audio", state.models.audio);
  localStorage.setItem("chellot_model_video", state.models.video);

  updateModelBadge();
  closeSettings();
  showToast("Settings saved successfully!");
}

function setTheme(theme) {
  state.theme = theme;
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem("chellot_theme", theme);

  // Update highlight
  document.querySelectorAll('[id^="theme-btn-"]').forEach((btn) => {
    btn.style.borderColor = "var(--glass-border)";
  });
  const activeBtn = document.getElementById(`theme-btn-${theme}`);
  if (activeBtn) activeBtn.style.borderColor = "var(--accent)";
}

function setAnswerMode(mode) {
  state.answerMode = mode;
  localStorage.setItem("chellot_answer_mode", mode);

  if (mode === "simple") {
    document
      .getElementById("mode-simple")
      .classList.replace("text-textMuted", "text-white");
    document.getElementById("mode-simple").classList.add("bg-accent");
    document
      .getElementById("mode-detailed")
      .classList.replace("text-white", "text-textMuted");
    document.getElementById("mode-detailed").classList.remove("bg-accent");
  } else {
    document
      .getElementById("mode-detailed")
      .classList.replace("text-textMuted", "text-white");
    document.getElementById("mode-detailed").classList.add("bg-accent");
    document
      .getElementById("mode-simple")
      .classList.replace("text-white", "text-textMuted");
    document.getElementById("mode-simple").classList.remove("bg-accent");
  }
}

function showToast(message) {
  const toast = document.getElementById("toast");
  document.getElementById("toast-message").innerText = message;
  toast.classList.remove("translate-y-20", "opacity-0");
  setTimeout(() => {
    toast.classList.add("translate-y-20", "opacity-0");
  }, 3000);
}

function updateModelBadge() {
  const textModel = state.models.text || MODEL_LISTS.text[0];
  document.getElementById("active-model-badge").innerText =
    "Text: " + textModel.split("/").pop();
}

function setGenerationState(isGenerating) {
  state.isGenerating = isGenerating;
  const btn = document.getElementById("send-button");
  if (isGenerating) {
    btn.innerHTML = '<i class="fas fa-square"></i>';
    btn.onclick = stopGeneration;
    btn.classList.add("bg-red-500", "hover:bg-red-600", "shadow-red-500/30");
    btn.classList.remove("bg-accent", "shadow-accent/30");
  } else {
    btn.innerHTML = '<i class="fas fa-paper-plane"></i>';
    btn.onclick = () => sendMessage();
    btn.classList.remove("bg-red-500", "hover:bg-red-600", "shadow-red-500/30");
    btn.classList.add("bg-accent", "shadow-accent/30");
  }
}

function stopGeneration() {
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
  setGenerationState(false);
  updateModelBadge();
  showToast("Generation stopped");
}

/* --- CHAT LOGIC --- */
function startNewChat() {
  if (state.isGenerating) stopGeneration();
  state.currentChatId = null;
  document.getElementById("chat-feed").innerHTML = `
        <div id="empty-state" class="h-full flex flex-col items-center justify-center text-center fade-in">
            <div class="w-20 h-20 rounded-full bg-glass flex items-center justify-center mb-6 border border-glassBorder shadow-glass">
                <i class="fas fa-robot text-4xl text-accent"></i>
            </div>
            <h3 class="text-2xl font-bold mb-2">How can I help you today?</h3>
            <p class="text-textMuted max-w-md">Ask me anything, generate images, or create audio and video prompts.</p>
        </div>`;
  document.getElementById("current-chat-title").innerText = "New Conversation";
  if (window.innerWidth < 768) toggleSidebar();
}

function saveChats() {
  localStorage.setItem("chellot_chats", JSON.stringify(state.chats));
  renderHistory();
}

function renderHistory() {
  const container = document.getElementById("history-container");
  container.innerHTML = "";

  if (state.chats.length === 0) {
    container.innerHTML =
      '<p class="text-sm text-textMuted text-center mt-4">No chat history yet.</p>';
    return;
  }

  const pinned = state.chats
    .filter((c) => c.pinned && c.id !== "instructions_chat")
    .sort((a, b) => b.timestamp - a.timestamp);
  const unpinned = state.chats
    .filter((c) => !c.pinned && c.id !== "instructions_chat")
    .sort((a, b) => b.timestamp - a.timestamp);

  const renderGroup = (chats, title) => {
    if (chats.length === 0) return;
    if (title) {
      const titleEl = document.createElement("div");
      titleEl.className =
        "text-[10px] text-textMuted uppercase tracking-wider mb-2 mt-4 px-2 font-semibold";
      titleEl.innerText = title;
      container.appendChild(titleEl);
    }
    chats.forEach((chat) => {
      const div = document.createElement("div");
      div.className = `p-3 rounded-xl cursor-pointer hover:bg-glassBorder transition text-sm flex justify-between items-center group mb-1 ${chat.id === state.currentChatId ? "bg-glassBorder border border-glassBorder shadow-sm" : ""}`;
      div.innerHTML = `
                <div class="truncate flex-1 pr-2" onclick="loadChat('${chat.id}')">
                    <div class="font-medium truncate">${chat.title}</div>
                    <div class="text-[10px] text-textMuted mt-0.5">${new Date(chat.timestamp).toLocaleDateString()}</div>
                </div>
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="togglePin('${chat.id}', event)" class="${chat.pinned ? "text-accent" : "text-textMuted hover:text-textMain"} p-1.5 tooltip" title="${chat.pinned ? "Unpin" : "Pin"}">
                        <i class="fas fa-thumbtack text-xs"></i>
                    </button>
                    ${
                      chat.id !== "instructions_chat"
                        ? `
                    <button onclick="deleteChat('${chat.id}', event)" class="text-textMuted hover:text-red-400 p-1.5 tooltip" title="Delete">
                        <i class="fas fa-trash text-xs"></i>
                    </button>
                    `
                        : ""
                    }
                </div>
            `;
      // Keep pin visible if it's pinned even without hover
      if (chat.pinned) {
        div
          .querySelector(".flex.items-center")
          .classList.remove("opacity-0", "group-hover:opacity-100");
      }
      container.appendChild(div);
    });
  };

  renderGroup(pinned, "Pinned");
  renderGroup(unpinned, pinned.length > 0 ? "Recent" : null);
}

function togglePin(id, event) {
  event.stopPropagation();
  const chat = state.chats.find((c) => c.id === id);
  if (chat) {
    chat.pinned = !chat.pinned;
    saveChats();
  }
}

function loadChat(id) {
  if (state.isGenerating) stopGeneration();
  const chat = state.chats.find((c) => c.id === id);
  if (!chat) {
    console.warn("Chat not found:", id);
    startNewChat();
    return;
  }

  state.currentChatId = id;
  document.getElementById("current-chat-title").innerText = chat.title;

  const feed = document.getElementById("chat-feed");
  feed.innerHTML = "";

  if (chat.messages && chat.messages.length > 0) {
    chat.messages.forEach((msg) => {
      if (msg && msg.role && msg.content) {
        appendMessageToUI(msg);
      }
    });
  }

  scrollToBottom();
  renderHistory(); // update active state in sidebar
  if (
    window.innerWidth < 768 &&
    document.getElementById("sidebar").classList.contains("open")
  )
    toggleSidebar();
}

function deleteChat(id, event) {
  event.stopPropagation();
  state.chats = state.chats.filter((c) => c.id !== id);
  saveChats();
  if (state.currentChatId === id) startNewChat();
}

function clearCurrentChat() {
  if (state.currentChatId) {
    deleteChat(state.currentChatId, { stopPropagation: () => {} });
  } else {
    startNewChat();
  }
}

function exportChat() {
  if (!state.currentChatId) return showToast("No active chat to export.");
  const chat = state.chats.find((c) => c.id === state.currentChatId);
  if (!chat) return;

  let text = `# ${chat.title}\nDate: ${new Date(chat.timestamp).toLocaleString()}\n\n`;
  chat.messages.forEach((m) => {
    text += `### ${m.role === "user" ? "You" : "Chellot"}\n${m.content}\n\n---\n\n`;
  });

  const blob = new Blob([text], { type: "text/markdown" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `Chellot_Chat_${chat.title.replace(/\s+/g, "_")}.md`;
  a.click();
}

/* --- MESSAGING & API --- */
async function sendMessage(regenerateIdx = null) {
  if (state.isGenerating) return;

  let content;
  let messageContent;
  let rawTextContent = "";

  if (regenerateIdx !== null) {
    // We are regenerating from a specific point
    const chat = state.chats.find((c) => c.id === state.currentChatId);
    messageContent = chat.messages[regenerateIdx - 1].content;

    if (typeof messageContent === "string") rawTextContent = messageContent;
    else
      rawTextContent =
        messageContent.find((p) => p.type === "text")?.text || "";

    // Truncate history
    chat.messages = chat.messages.slice(0, regenerateIdx);
    loadChat(state.currentChatId); // Re-render truncated
  } else {
    const input = document.getElementById("message-input");
    content = input.value.trim();
    if (!content && state.currentAttachedMedia.length === 0) return;
    input.value = "";
    input.style.height = "auto";

    rawTextContent = content;

    if (state.currentAttachedMedia.length > 0) {
      messageContent = [];
      if (content) messageContent.push({ type: "text", text: content });

      state.currentAttachedMedia.forEach((media) => {
        messageContent.push({
          type: "image_url",
          image_url: { url: media.url },
        });
      });
    } else {
      messageContent = content;
    }

    // First message creates a new chat
    if (!state.currentChatId) {
      state.currentChatId = "chat_" + Date.now();
      const newChat = {
        id: state.currentChatId,
        title: content
          ? content.substring(0, 30) + (content.length > 30 ? "..." : "")
          : "Image Generation",
        timestamp: Date.now(),
        messages: [],
      };
      state.chats.push(newChat);
      document.getElementById("current-chat-title").innerText = newChat.title;
      document.getElementById("empty-state")?.remove();
    }

    const userMsg = {
      role: "user",
      content: messageContent,
      timestamp: Date.now(),
    };
    const chat = state.chats.find((c) => c.id === state.currentChatId);
    chat.messages.push(userMsg);
    appendMessageToUI(userMsg);

    // Clear attachments after sending
    state.currentAttachedMedia = [];
    renderAttachments();
  }

  saveChats();
  scrollToBottom();

  // Determine Intent and Model
  const intent = detectIntent(rawTextContent);
  const categoryModels = MODEL_LISTS[intent];
  let activeModel = state.models[intent] || categoryModels[0];

  // UI State updates
  document.getElementById("active-model-badge").innerText =
    `${intent.charAt(0).toUpperCase() + intent.slice(1)}: ${activeModel.split("/").pop()}`;
  setGenerationState(true);

  const aiMsgId = "msg_" + Date.now();

  // Append Typing Indicator
  const typingHtml = `
        <div id="${aiMsgId}" class="flex gap-4 slide-up">
            <div class="w-8 h-8 rounded-full bg-accent shrink-0 flex items-center justify-center border border-glassBorder shadow-neon mt-1">
                <i class="fas fa-robot text-white text-xs"></i>
            </div>
            <div class="ai-msg-glass p-4 rounded-2xl rounded-tl-sm text-sm">
                <div class="typing-indicator flex items-center h-4">
                    <span></span><span></span><span></span>
                </div>
            </div>
        </div>`;
  document
    .getElementById("chat-feed")
    .insertAdjacentHTML("beforeend", typingHtml);
  scrollToBottom();

  // Construct Messages Payload
  const chat = state.chats.find((c) => c.id === state.currentChatId);
  const systemPrompt =
    state.answerMode === "simple"
      ? "You are Chellot, a highly concise AI. Respond in maximum 5 lines or 80 words. Be direct."
      : "You are Chellot, a detailed and helpful AI. Provide full explanations, examples, and structured formatting (Markdown).";

  const apiMessages = [
    { role: "system", content: systemPrompt },
    ...chat.messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  abortController = new AbortController();

  // Execute API Call with Fallback Logic
  await executeWithFallback(
    intent,
    categoryModels,
    activeModel,
    apiMessages,
    aiMsgId,
  );
}

function detectIntent(text) {
  const t = text.toLowerCase();

  // Video intent
  if (
    t.match(
      /\b(generate|create|edit|make|ask for|animate|convert to|convert)\s+(a\s+|an\s+)?(video|clip|mp4|animation|movie)\b/i,
    ) ||
    t.match(/\b(video generation|video editing)\b/i)
  ) {
    return "video";
  }

  // Audio intent
  if (
    t.match(
      /\b(generate|create|edit|make|ask for|convert to|compose|convert|sing)\s+(an\s+|a\s+)?(audio|mp3|sound|voice|song|music|track)\b/i,
    ) ||
    t.match(
      /\b(audio generation|voice generation|music generation|text to speech|text-to-speech)\b/i,
    )
  ) {
    return "audio";
  }

  // Image intent
  if (
    t.match(
      /\b(generate|create|edit|make|ask for|draw|illustrate|show me|paint|design|convert to|convert)\s+(an\s+|a\s+)?(image|picture|photo|pic|drawing|illustration|art)\b/i,
    ) ||
    t.match(/\b(image generation)\b/i)
  ) {
    return "image";
  }

  return "text";
}

async function executeWithFallback(
  intent,
  modelList,
  initialModel,
  messages,
  aiMsgId,
) {
  let attemptIndex = modelList.indexOf(initialModel);
  if (attemptIndex === -1) attemptIndex = 0;

  for (let i = 0; i < modelList.length; i++) {
    if (!abortController) return; // User stopped generation
    const currentModel = modelList[(attemptIndex + i) % modelList.length];

    if (i > 0) {
      showToast(
        `Model unavailable, switching to ${currentModel.split("/").pop()}...`,
      );
      document.getElementById("active-model-badge").innerText =
        `Fallback: ${currentModel.split("/").pop()}`;
    }

    try {
      const success = await callOpenRouter(
        currentModel,
        messages,
        aiMsgId,
        intent,
      );
      if (success || !abortController) {
        if (abortController) {
          finalizeMessageGeneration(aiMsgId, currentModel);
          if (i > 0) {
            state.models[intent] = currentModel;
            localStorage.setItem("chellot_model_" + intent, currentModel);
          }
        }
        return; // Done!
      }
    } catch (err) {
      if (err.name === "AbortError") return; // User aborted
      console.error("API Error with model " + currentModel, err);
      // Continue to next model
    }
  }

  if (!abortController) return;
  // All failed
  replaceTypingWithContent(
    aiMsgId,
    "⚠️ Sorry, all available models for this task are currently unresponsive or failed. Please check your API key or try again later.",
    true,
  );
  finalizeMessageGeneration(aiMsgId, null, true);
}

async function callOpenRouter(model, messages, aiMsgId, intent) {
  const isText = intent === "text";
  const reqBody = {
    model: model,
    messages: messages,
    stream: isText, // Only stream for text usually
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${state.apiKey}`,
      "HTTP-Referer": window.location.href,
      "X-Title": "Chellot AI",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
    signal: abortController.signal,
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  if (isText) {
    // Stream handling
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";
    let hasRemovedTyping = false;
    const container = document
      .getElementById(aiMsgId)
      .querySelector(".ai-msg-glass");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data);
            const token = parsed.choices[0]?.delta?.content || "";
            fullText += token;

            if (!hasRemovedTyping && fullText.trim().length > 0) {
              container.innerHTML =
                '<div class="prose prose-invert max-w-none text-textMain response-content"></div>';
              hasRemovedTyping = true;
            }

            if (hasRemovedTyping) {
              const contentDiv = container.querySelector(".response-content");
              contentDiv.innerHTML = DOMPurify.sanitize(marked.parse(fullText));
              // Highlight code
              contentDiv.querySelectorAll("pre code").forEach((block) => {
                hljs.highlightElement(block);
              });
            }
            // Only auto scroll if we are near the bottom
            const feed = document.getElementById("chat-feed");
            if (feed.scrollHeight - feed.scrollTop - feed.clientHeight < 150) {
              scrollToBottom();
            }
          } catch (e) {
            // sometimes fragmented json
          }
        }
      }
    }

    // Save to state
    if (fullText.trim()) {
      appendAIChatToState(fullText, model);
      addActionButtons(aiMsgId, model);
      return true;
    } else {
      throw new Error("Empty response");
    }
  } else {
    // Non-streaming handling (Image/Video/Audio URLs usually returned in text)
    const data = await response.json();
    const content = data.choices[0]?.message?.content || "";
    if (content) {
      replaceTypingWithContent(aiMsgId, content, false);
      appendAIChatToState(content, model);
      addActionButtons(aiMsgId, model);
      return true;
    }
    throw new Error("Empty response");
  }
}

function replaceTypingWithContent(msgId, markdownContent, isError) {
  try {
    const msgElement = document.getElementById(msgId);
    if (!msgElement) {
      console.warn("Message element not found:", msgId);
      return;
    }

    const container = msgElement.querySelector(".ai-msg-glass");
    if (!container) {
      console.warn("Message container not found");
      return;
    }

    if (isError) {
      container.classList.add("border-red-500/50", "bg-red-900/20");
      container.innerHTML = `<div class="prose prose-invert max-w-none text-red-400">${markdownContent}</div>`;
    } else {
      container.innerHTML = `<div class="prose prose-invert max-w-none text-textMain response-content">${DOMPurify.sanitize(marked.parse(markdownContent))}</div>`;
    }
  } catch (err) {
    console.error("Error replacing typing with content:", err);
  }
}

function finalizeMessageGeneration(msgId, finalModel, isError = false) {
  setGenerationState(false);
  document.getElementById("message-input").focus();
  updateModelBadge();
}

function appendAIChatToState(content, model) {
  const chat = state.chats.find((c) => c.id === state.currentChatId);
  if (chat) {
    chat.messages.push({ role: "ai", content, timestamp: Date.now(), model });
    saveChats();
  }
}

/* --- UI HELPERS --- */
function appendMessageToUI(msg) {
  const feed = document.getElementById("chat-feed");
  const isUser = msg.role === "user";
  const id = "msg_" + msg.timestamp;

  const timeStr = new Date(msg.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  let textContent = "";
  let imagesHtml = "";
  if (typeof msg.content === "string") {
    textContent = msg.content;
  } else {
    msg.content.forEach((part) => {
      if (part.type === "text") textContent += part.text;
      if (part.type === "image_url")
        imagesHtml += `<img src="${part.image_url.url}" class="max-w-xs rounded-lg mt-2 mb-2 border border-glassBorder shadow-glass">`;
    });
  }

  let html = "";
  if (isUser) {
    html = `
        <div class="flex justify-end fade-in" id="${id}">
            <div class="max-w-[80%] flex flex-col items-end group">
                <div class="user-msg-glass text-textMain p-4 rounded-2xl rounded-tr-sm break-words w-full">
                    ${imagesHtml}
                    ${textContent.replace(/\n/g, "<br>")}
                </div>
                <span class="text-[10px] text-textMuted mt-1 opacity-0 group-hover:opacity-100 transition-opacity">${timeStr}</span>
            </div>
        </div>`;
  } else {
    html = `
        <div class="flex gap-4 fade-in" id="${id}">
            <div class="w-8 h-8 rounded-full bg-accent shrink-0 flex items-center justify-center border border-glassBorder shadow-neon mt-1">
                <i class="fas fa-robot text-white text-xs"></i>
            </div>
            <div class="ai-msg-glass p-4 rounded-2xl rounded-tl-sm text-sm w-full max-w-[85%] group relative overflow-x-auto">
                <div class="prose prose-invert max-w-none text-textMain">
                    ${DOMPurify.sanitize(marked.parse(textContent))}
                </div>
                <div class="flex justify-between items-center mt-3 pt-2 border-t border-glassBorder/30">
                    <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onclick="copyMsg('${id}')" class="text-textMuted hover:text-textMain tooltip" title="Copy"><i class="fas fa-copy"></i></button>
                        <button onclick="regenMsg('${id}')" class="text-textMuted hover:text-accent tooltip" title="Regenerate"><i class="fas fa-sync-alt"></i></button>
                    </div>
                    <div class="text-[10px] text-textMuted font-mono">
                        ${timeStr}${msg.model ? ` • ${msg.model.split("/").pop()}` : ""}
                    </div>
                </div>
            </div>
        </div>`;
  }

  feed.insertAdjacentHTML("beforeend", html);

  // Highlight block if AI
  if (!isUser) {
    try {
      const msgElement = document.getElementById(id);
      if (msgElement) {
        msgElement.querySelectorAll("pre code").forEach((block) => {
          if (block && hljs) hljs.highlightElement(block);
        });
      }
    } catch (err) {
      console.error("Highlighting error:", err);
    }
  }
}

function addActionButtons(msgId, modelName = null) {
  try {
    const msgElement = document.getElementById(msgId);
    if (!msgElement) {
      console.warn("Message element not found:", msgId);
      return;
    }

    const container = msgElement.querySelector(".ai-msg-glass");
    if (!container) {
      console.warn("Message container not found");
      return;
    }

    const timeStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (!container.querySelector(".fa-copy")) {
      // prevent duplicates
      const modelStr = modelName ? ` • ${modelName.split("/").pop()}` : "";
      const actionsHtml = `
            <div class="flex justify-between items-center mt-3 pt-2 border-t border-glassBorder/30 group">
                <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="copyMsg('${msgId}')" class="text-textMuted hover:text-textMain tooltip" title="Copy"><i class="fas fa-copy"></i></button>
                    <button onclick="regenMsg('${msgId}')" class="text-textMuted hover:text-accent tooltip" title="Regenerate"><i class="fas fa-sync-alt"></i></button>
                </div>
                <div class="text-[10px] text-textMuted font-mono">
                    ${timeStr}${modelStr}
                </div>
            </div>`;
      container.insertAdjacentHTML("beforeend", actionsHtml);
    }
  } catch (err) {
    console.error("Error adding action buttons:", err);
  }
}

function copyMsg(id) {
  try {
    const element = document.getElementById(id);
    if (!element) {
      showToast("Error: Message not found");
      return;
    }

    // Try to find prose div, otherwise get all text content
    let proseElement = element.querySelector(".prose");
    if (!proseElement) {
      proseElement = element.querySelector(".response-content");
    }
    if (!proseElement) {
      proseElement = element.querySelector(".text-red-400");
    }

    if (!proseElement) {
      showToast("Error: Could not extract message text");
      return;
    }

    const text = proseElement.innerText;
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard");
  } catch (err) {
    console.error("Copy error:", err);
    showToast("Failed to copy message");
  }
}

function regenMsg(id) {
  try {
    const chat = state.chats.find((c) => c.id === state.currentChatId);
    if (!chat) {
      showToast("Error: Chat not found");
      return;
    }

    // Find index of this message in the chat
    const lastMsgIdx = chat.messages.length - 1;
    if (lastMsgIdx >= 0 && chat.messages[lastMsgIdx].role === "ai") {
      sendMessage(lastMsgIdx);
    } else {
      showToast("Can only regenerate the latest AI response.");
    }
  } catch (err) {
    console.error("Regenerate error:", err);
    showToast("Failed to regenerate message");
  }
}

function scrollToBottom() {
  try {
    const feed = document.getElementById("chat-feed");
    if (feed) {
      feed.scrollTo({ top: feed.scrollHeight, behavior: "smooth" });
    }
  } catch (err) {
    console.error("Scroll error:", err);
  }
}

/* --- FILE UPLOAD LOGIC --- */
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    state.currentAttachedMedia.push({
      url: e.target.result,
      type: file.type,
      name: file.name,
    });
    renderAttachments();
  };
  reader.readAsDataURL(file);
  event.target.value = ""; // reset input
}

function removeAttachment(index) {
  state.currentAttachedMedia.splice(index, 1);
  renderAttachments();
}

function renderAttachments() {
  const container = document.getElementById("attachment-preview");
  if (state.currentAttachedMedia.length === 0) {
    container.classList.add("hidden");
    container.innerHTML = "";
    return;
  }

  container.classList.remove("hidden");
  container.innerHTML = state.currentAttachedMedia
    .map(
      (media, idx) => `
        <div class="relative w-16 h-16 shrink-0 group mt-2">
            <img src="${media.url}" class="w-full h-full object-cover rounded-lg border border-glassBorder shadow-glass" alt="Attachment">
            <button onclick="removeAttachment(${idx})" class="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `,
    )
    .join("");
}
