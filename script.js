const input   = document.getElementById("input"),
      list    = document.getElementById("list"),
      summary = document.getElementById("summary"),
      empty   = document.getElementById("empty"),
      addBtn  = document.getElementById("add"),
      clearBtn= document.getElementById("clear");

function getItems() {
  return JSON.parse(localStorage.todo || "[]");
}

function saveItems(items) {
  localStorage.todo = JSON.stringify(items);
}

function render() {
  const items = getItems();
  list.innerHTML = "";
  if (!items.length) {
    empty.style.display = "block";
    summary.textContent = "0 left";
    return;
  }
  empty.style.display = "none";
  let left = 0;

  items.forEach((t, i) => {
    if (!t.done) left++;
    const li = document.createElement("li");
    li.className = t.done ? "done" : "";
    li.innerHTML =
      `<input type="checkbox" ${t.done ? "checked" : ""} data-i="${i}">
       <div class="text">${t.text}</div>
       <button class="del" data-del="${i}">✕</button>`;
    list.appendChild(li);
  });

  summary.textContent = left + " left";
}

function addTask() {
  const text = input.value.trim();
  if (!text) return;
  const items = getItems();
  items.unshift({ text, done: false });
  saveItems(items);
  input.value = "";
  input.focus();
  render();
}

addBtn.onclick = addTask;
input.onkeydown = e => e.key === "Enter" && addTask();

list.onclick = e => {
  const i = e.target.dataset.i,
        d = e.target.dataset.del;
  if (i !== undefined) {
    const items = getItems();
    items[i].done = !items[i].done;
    saveItems(items);
    render();
  }
  if (d !== undefined) {
    const items = getItems();
    items.splice(d, 1);
    saveItems(items);
    render();
  }
};

clearBtn.onclick = () => {
  const items = getItems().filter(t => !t.done);
  saveItems(items);
  render();
};

render();