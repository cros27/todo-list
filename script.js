const input = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos() {
  todoList.innerHTML = "";

  todos.forEach((todo, index) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = todo.text;
    if (todo.done) span.classList.add("done");

    span.addEventListener("click", () => {
      todos[index].done = !todos[index].done;
      saveTodos();
      renderTodos();
    });

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const newText = prompt("Edit todo:", todo.text);
      if (newText !== null && newText.trim() !== "") {
        todos[index].text = newText.trim();
        saveTodos();
        renderTodos();
      }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      todos.splice(index, 1);
      saveTodos();
      renderTodos();
    });

    li.appendChild(span);
    li.appendChild(editBtn);
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

renderTodos();