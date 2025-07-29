

function login() {
  const name = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (name && pass) {
    localStorage.setItem("studentName", name);
    window.location.href = "dashboard.html";
  } else {
    alert("Please enter name and password.");
  }
}

function saveJournal() {
  const entry = document.getElementById("journal-entry").value;
  localStorage.setItem("journal", entry);
  alert("Journal saved.");
}

function exportJournalToPDF() {
  const entry = document.getElementById("journal-entry").value;
  const win = window.open("", "_blank");
  win.document.write(`<pre>${entry}</pre>`);
  win.print();
}

function addTask() {
  const task = document.getElementById("todo-input").value;
  const list = document.getElementById("todo-list");
  const li = document.createElement("li");
  li.textContent = task;
  list.appendChild(li);
  document.getElementById("todo-input").value = "";
  addXP(5);
}

function exportTasksToPDF() {
  const tasks = document.getElementById("todo-list").innerText;
  const win = window.open("", "_blank");
  win.document.write(`<pre>${tasks}</pre>`);
  win.print();
}

function addPlannerTask() {
  const date = document.getElementById("planner-date").value;
  const task = document.getElementById("planner-task").value;
  const li = document.createElement("li");
  li.textContent = `${date}: ${task}`;
  document.getElementById("planner-list").appendChild(li);
  addXP(3);
}

let flashcards = [];
let currentCard = 0;

function generateFlashcards() {
  const text = document.getElementById("note-input").value;
  const lines = text.split(".");
  flashcards = lines.map((line, index) => `Q${index + 1}: What about - "${line.trim()}"?`);
  currentCard = 0;
  loadFlashcard();
  addXP(10);
}

function loadFlashcard() {
  const flash = document.getElementById("flashcard");
  if (flashcards.length > 0) {
    flash.textContent = flashcards[currentCard % flashcards.length];
  } else {
    flash.textContent = "No flashcards generated yet.";
  }
}

function showNextCard() {
  if (flashcards.length === 0) {
    document.getElementById("flashcard").textContent = "No flashcards available.";
    return;
  }
  currentCard = (currentCard + 1) % flashcards.length;
  loadFlashcard();
}

let sound;
function playSound() {
  const ambient = document.getElementById("ambient-sound").value;
  if (ambient === "none") return;
  sound = new Audio(`${ambient}.mp3`);
  sound.loop = true;
  sound.play();
}

function stopSound() {
  if (sound) sound.pause();
}

let xp = 0, level = 1;
function addXP(points) {
  xp += points;
  if (xp >= 100) {
    xp = 0;
    level++;
  }
  updateProgress();
}

function updateProgress() {
  document.getElementById("xp").textContent = xp;
  document.getElementById("level").textContent = level;
}

async function askAssistant() {
  const input = document.getElementById("chat-input").value.trim();
  if (!input) return;

  const box = document.getElementById("chat-box");

  const userMsg = document.createElement("div");
  userMsg.textContent = `You: ${input}`;
  box.appendChild(userMsg);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer YOUR_OPENAI_API_KEY_HERE", // ← Replace this
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: input }],
        max_tokens: 150
      })
    });

    const data = await response.json();
    const aiReply = data.choices?.[0]?.message?.content || "Sorry, I couldn't understand that.";

    const reply = document.createElement("div");
    reply.textContent = `AI: ${aiReply}`;
    box.appendChild(reply);
  } catch (err) {
    const errorMsg = document.createElement("div");
    errorMsg.textContent = "AI: Something went wrong. Try again.";
    box.appendChild(errorMsg);
    console.error(err);
  }

  document.getElementById("chat-input").value = "";
  box.scrollTop = box.scrollHeight;
}

document.getElementById("theme-toggle")?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

document.getElementById("color-theme")?.addEventListener("change", (e) => {
  document.body.classList.remove("ocean", "rose");
  const selected = e.target.value;
  if (selected !== "default") document.body.classList.add(selected);
});
