const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
let chatMemory = JSON.parse(localStorage.getItem("chatMemory") || "[]");

function toggleButton() {
  if (input.value.trim().length > 0 && navigator.onLine) {
    sendBtn.classList.add("active");
    sendBtn.classList.remove("disabled");
  } else {
    sendBtn.classList.remove("active");
    sendBtn.classList.add("disabled");
  }
}

function saveMemory() {
  localStorage.setItem("chatMemory", JSON.stringify(chatMemory));
}

function smoothType(div, text, done) {
  let i = 0;
  function type() {
    if (i >= text.length) {
      if (done) done();
      return;
    }
    div.innerText += text[i];
    i++;
    chatBox.scrollTop = chatBox.scrollHeight;
    setTimeout(type, 22);
  }
  type();
}

function addMessage(msg, type, isCode = false) {
  const div = document.createElement("div");
  div.className = "msg " + type;
  if (isCode) {
    const pre = document.createElement("pre");
    pre.className = "code-block";
    pre.innerText = msg;
    div.appendChild(pre);
  } else {
    if (type === "user") {
      div.innerText = msg;
    } else {
      div.innerText = "";
      smoothType(div, msg);
    }
  }
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function disableInput(state) {
  input.disabled = state;
  sendBtn.disabled = state;
}

async function sendMessage() {
  if (!navigator.onLine) {
    addMessage("⚠️ Network error! Please check your internet connection.", "ai");
    return;
  }
  const text = input.value.trim();
  if (!text) return;
  disableInput(true);
  addMessage(text, "user");
  chatMemory.push({ role: "user", content: text });
  saveMemory();
  input.value = "";
  toggleButton();
  addMessage("Jaimin is thinking...", "ai");

  try {
    const response = await fetch("https://myai-6.onrender.com/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: text, history: chatMemory })
    });
    const data = await response.json();
    document.querySelectorAll(".ai")[document.querySelectorAll(".ai").length - 1].remove();
    const reply = data.reply || "Something went wrong.";
    chatMemory.push({ role: "ai", content: reply });
    saveMemory();
    addMessage(reply, "ai");
  } catch {
    document.querySelectorAll(".ai")[document.querySelectorAll(".ai").length - 1].remove();
    addMessage("⚠️ Network error! Could not connect to Jaimin (AI Chat) server.", "ai");
  } finally {
    disableInput(false);
    toggleButton();
  }
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", (e) => { if (e.key === "Enter") sendMessage(); });
window.addEventListener("online", toggleButton);
window.addEventListener("offline", toggleButton);
toggleButton();
