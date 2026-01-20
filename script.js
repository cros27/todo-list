const input = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const filterButtons = document.querySelectorAll(".filters button");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getFilteredTodos() {
  if (currentFilter === "active") {
    return todos.filter(t => !t.done);
  }
  if (currentFilter === "done") {
    return todos.filter(t => t.done);
  }
  return todos;
}

function renderTodos() {
  todoList.innerHTML = "";

  getFilteredTodos().forEach(todo => {
    const index = todos.indexOf(todo);

    const li = document.createElement("li");
    li.textContent = todo.text;

    if (todo.done) li.classList.add("done");

    li.addEventListener("click", () => {
      todos[index].done = !todos[index].done;
      saveTodos();
      renderTodos();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      todos.splice(index, 1);
      saveTodos();
      renderTodos();
    });

    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
}

addBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (text === "") return;

  todos.push({ text, done: false });
  saveTodos();
  renderTodos();
  input.value = "";
});

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;

    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    renderTodos();
  });
});

renderTodos();