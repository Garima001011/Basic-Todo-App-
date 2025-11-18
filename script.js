const input      = document.getElementById("input");
const list       = document.getElementById("list");
const empty      = document.getElementById("empty");
const addBtn     = document.getElementById("add");
const clearBtn   = document.getElementById("clear");
const filters    = document.querySelectorAll(".filter");
const leftSpan   = document.getElementById("leftCount");
const doneSpan   = document.getElementById("doneCount");
const dateBox    = document.getElementById("date");
const dateInput  = document.getElementById("dateInput");
const startInput = document.getElementById("startInput");
const endInput   = document.getElementById("endInput");

let currentFilter = "all";

function setToday() {
  const d = new Date();
  const opts = { weekday: "short", month: "short", day: "numeric" };
  dateBox.textContent = d.toLocaleDateString(undefined, opts);
}

function getItems() {
  return JSON.parse(localStorage.todoPink || "[]");
}

function saveItems(items) {
  localStorage.todoPink = JSON.stringify(items);
}

function formatDate(d) {
  if (!d) return "";
  try {
    const date = new Date(d);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
  } catch {
    return "";
  }
}

function formatTimeRange(start, end) {
  if (!start && !end) return "";
  if (start && end) return `${start} – ${end}`;
  return start || end || "";
}

function render() {
  const items = getItems();
  list.innerHTML = "";

  const visible = items.filter(t => {
    if (currentFilter === "active") return !t.done;
    if (currentFilter === "done") return t.done;
    return true;
  });

  if (!visible.length) {
    empty.style.display = "block";
  } else {
    empty.style.display = "none";
    visible.forEach(t => {
      const li = document.createElement("li");
      li.className = t.done ? "done" : "";

      const dateText = formatDate(t.date);
      const timeText = formatTimeRange(t.startTime, t.endTime);
      let meta = "";

      if (dateText && timeText) meta = `${dateText} • ${timeText}`;
      else if (dateText) meta = dateText;
      else if (timeText) meta = timeText;

      li.innerHTML = `
        <input type="checkbox" data-id="${t.id}" ${t.done ? "checked" : ""}>
        <div class="task-body">
          <div class="text">${t.text}</div>
          ${meta ? `<div class="meta">${meta}</div>` : ""}
        </div>
        <button class="clear-btn" data-del="${t.id}">✕</button>
      `;
      list.appendChild(li);
    });
  }

  const left = items.filter(t => !t.done).length;
  const done = items.filter(t => t.done).length;
  leftSpan.textContent = `${left} left`;
  doneSpan.textContent = `${done} done`;
}

function addTask() {
  const text = input.value.trim();
  if (!text) return;

  const newItem = {
    id: Date.now(),
    text,
    done: false,
    date: dateInput.value || "",
    startTime: startInput.value || "",
    endTime: endInput.value || ""
  };

  const items = getItems();
  items.unshift(newItem);
  saveItems(items);

  input.value = "";
  startInput.value = "";
  endInput.value = "";
  // keep selected date so you can add multiple tasks for same day
  input.focus();
  render();
}

addBtn.addEventListener("click", addTask);

input.addEventListener("keydown", e => {
  if (e.key === "Enter") addTask();
});

list.addEventListener("click", e => {
  const id = e.target.dataset.id;
  const delId = e.target.dataset.del;
  if (!id && !delId) return;

  let items = getItems();

  if (id) {
    items = items.map(t =>
      t.id.toString() === id ? { ...t, done: !t.done } : t
    );
  }

  if (delId) {
    items = items.filter(t => t.id.toString() !== delId);
  }

  saveItems(items);
  render();
});

clearBtn.addEventListener("click", () => {
  const items = getItems().filter(t => !t.done);
  saveItems(items);
  render();
});

filters.forEach(btn => {
  btn.addEventListener("click", () => {
    filters.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

setToday();
render();
