const input = document.getElementById("todoInput");
const list = document.getElementById("todoList");
const toggle = document.getElementById("themeToggle");
const counter = document.getElementById("counter");
const filterBtns = document.querySelectorAll(".filters button");

const TODO_KEY = "todos";
const THEME_KEY = "todo-theme";

let todos = [];
let filter = "all";

/* ===== THEME ===== */
const themeToggle = document.getElementById("themeToggle");
const THEME_KEY = "todo-theme";

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "LIGHT";
  } else {
    themeToggle.textContent = "DARK";
  }
});

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");

  if (isDark) {
    themeToggle.textContent = "LIGHT";
    localStorage.setItem(THEME_KEY, "dark");
  } else {
    themeToggle.textContent = "DARK";
    localStorage.setItem(THEME_KEY, "light");
  }
});

/* ===== LOAD ===== */
document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem(TODO_KEY);
  if (saved) {
    todos = JSON.parse(saved);
    render();
  }
});

/* ===== ADD ===== */
input.addEventListener("keydown", e => {
  if (e.key === "Enter" && input.value.trim()) {
    todos.push({ text: input.value.trim(), done: false });
    input.value = "";
    save();
    render();
  }
});

/* ===== FILTER ===== */
filterBtns.forEach(btn => {
  btn.onclick = () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filter = btn.dataset.filter;
    render();
  };
});

/* ===== RENDER ===== */
function render() {
  list.innerHTML = "";

  todos
    .filter(t =>
      filter === "all" ||
      (filter === "active" && !t.done) ||
      (filter === "done" && t.done)
    )
    .forEach(todo => {
      const li = document.createElement("li");
      li.draggable = true;

      const span = document.createElement("span");
      span.textContent = todo.text;

      if (todo.done) li.classList.add("done");

      span.onclick = () => {
        todo.done = !todo.done;
        save();
        render();
      };

      span.ondblclick = () => {
        const inputEdit = document.createElement("input");
        inputEdit.value = todo.text;
        li.replaceChild(inputEdit, span);
        inputEdit.focus();

        inputEdit.onkeydown = e => {
          if (e.key === "Enter") {
            todo.text = inputEdit.value;
            save();
            render();
          }
        };
      };

      const del = document.createElement("button");
      del.textContent = "✕";
      del.onclick = () => {
        todos = todos.filter(t => t !== todo);
        save();
        render();
      };

      li.append(span, del);
      list.appendChild(li);
    });

  counter.textContent = `${todos.filter(t => !t.done).length} tasks left`;
}

/* ===== SAVE ===== */
function save() {
  localStorage.setItem(TODO_KEY, JSON.stringify(todos));
}
