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
if (localStorage.getItem(THEME_KEY) === "dark") {
  document.body.classList.add("dark");
  toggle.textContent = "Light";
}

toggle.onclick = () => {
  const isDark = document.body.classList.toggle("dark");
  toggle.textContent = isDark ? "Light" : "Dark";
  localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
};

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

  if (todos.length === 0) {
  const empty = document.createElement("p");
  empty.textContent = "No tasks yet. Add something meaningful.";
  empty.style.color = "var(--muted)";
  empty.style.marginTop = "40px";
  list.appendChild(empty);
  counter.textContent = "0 tasks";
  return;
}

  todos
  .filter(t =>
    filter === "all" ||
    (filter === "active" && !t.done) ||
    (filter === "done" && t.done)
  )
  .forEach((todo, index) => {
      const li = document.createElement("li");
      li.draggable = true;
      li.addEventListener("dragstart", () => {
  li.classList.add("dragging");
  li.dataset.index = index;
});

li.addEventListener("dragend", () => {
  li.classList.remove("dragging");
  save();
});

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
  li.classList.add("removing");
  setTimeout(() => {
    todos = todos.filter(t => t !== todo);
    save();
    render();
  }, 200);
};

      li.append(span, del);
      list.appendChild(li);
    });

  counter.textContent = `${todos.filter(t => !t.done).length} tasks left`;
}

document.addEventListener("keydown", e => {
  // Ctrl + N → fokus input
  if (e.ctrlKey && e.key.toLowerCase() === "n") {
    e.preventDefault();
    input.focus();
  }

  // Ctrl + D → hapus semua done
  if (e.ctrlKey && e.key.toLowerCase() === "d") {
    e.preventDefault();
    todos = todos.filter(t => !t.done);
    save();
    render();
  }

  // Esc → batal edit
  if (e.key === "Escape") {
    render();
  }
});

/* ===== SAVE ===== */
function save() {
  localStorage.setItem(TODO_KEY, JSON.stringify(todos));
}

list.addEventListener("dragover", e => {
  e.preventDefault();

  const dragging = document.querySelector(".dragging");
  if (!dragging) return;

  const siblings = [...list.querySelectorAll("li:not(.dragging)")];

  const next = siblings.find(li =>
    e.clientY <= li.offsetTop + li.offsetHeight / 2
  );

  if (next) {
    list.insertBefore(dragging, next);
  } else {
    list.appendChild(dragging);
  }

  // update order di array
  todos = [...list.children].map(li => {
    const text = li.querySelector("span").textContent;
    return todos.find(t => t.text === text);
  });

  save();
});
