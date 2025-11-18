const input     = document.getElementById("input");
const list      = document.getElementById("list");
const empty     = document.getElementById("empty");
const addBtn    = document.getElementById("add");
const clearBtn  = document.getElementById("clear");
const filters   = document.querySelectorAll(".filter");
const leftSpan  = document.getElementById("leftCount");
const doneSpan  = document.getElementById("doneCount");
const dateBox   = document.getElementById("date");

let currentFilter = "all";

function setToday() {
  const d = new Date();
  const opts = { weekday: "short", month: "short", day: "numeric" };
  dateBox.textContent = d.toLocaleDateString(undefined, opts);
}

function getItems() {
  return JSON.parse(localStorage.todo || "[]");
}

function saveItems(items) {
  localStorage.todo = JSON.stringify(items);
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
    visible.forEach((t, i) => {
      const li = document.createElement("li");
      li.className = t.done ? "done" : "";

      li.innerHTML = `
        <input type="checkbox" data-id="${t.id}" ${t.done ? "checked" : ""}>
        <div class="text">${t.text}</div>
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

  const items = getItems();
  items.unshift({
    id: Date.now(),
    text,
    done: false
  });
  saveItems(items);
  input.value = "";
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
