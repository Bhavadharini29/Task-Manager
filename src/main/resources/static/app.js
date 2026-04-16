const API_BASE = "/api/v1/todo";
let editingTodoId = null;

const elements = {
  todoForm: document.getElementById("todoForm"),
  formHeading: document.getElementById("formHeading"),
  submitBtn: document.getElementById("submitBtn"),
  cancelEditBtn: document.getElementById("cancelEditBtn"),
  title: document.getElementById("title"),
  description: document.getElementById("description"),
  isCompleted: document.getElementById("isCompleted"),
  refreshBtn: document.getElementById("refreshBtn"),
  todoList: document.getElementById("todoList"),
  statusMessage: document.getElementById("statusMessage")
};

function setStatus(message) {
  elements.statusMessage.textContent = message;
}

function setFormMode(isEditMode) {
  if (isEditMode) {
    elements.formHeading.textContent = "Edit Todo";
    elements.submitBtn.textContent = "Update Todo";
    elements.cancelEditBtn.style.display = "inline-block";
    return;
  }
  elements.formHeading.textContent = "Create Todo";
  elements.submitBtn.textContent = "Add Todo";
  elements.cancelEditBtn.style.display = "none";
}

function resetFormMode() {
  editingTodoId = null;
  elements.todoForm.reset();
  setFormMode(false);
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API ${response.status}: ${body || response.statusText}`);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function renderTodos(todos) {
  elements.todoList.innerHTML = "";

  if (!todos.length) {
    elements.todoList.innerHTML = "<li>No todos yet.</li>";
    return;
  }

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item";

    li.innerHTML = `
      <p class="todo-title">${escapeHtml(todo.title || "")}</p>
      <p class="todo-desc">${escapeHtml(todo.description || "")}</p>
      <p class="todo-meta">ID: ${todo.id ?? "-"} | Completed: ${Boolean(todo.isCompleted)}</p>
      <div class="todo-actions">
        <button data-action="edit" data-id="${todo.id}">Edit</button>
        <button data-action="toggle" data-id="${todo.id}">Toggle Complete</button>
        <button data-action="delete" data-id="${todo.id}" class="btn-danger">Delete</button>
      </div>
    `;

    elements.todoList.appendChild(li);
  });
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function fetchTodos() {
  setStatus("Loading todos...");
  try {
    const todos = await apiRequest("", { method: "GET" });
    renderTodos(todos);
    setStatus(`Loaded ${todos.length} todo(s).`);
  } catch (error) {
    setStatus(`Failed to load todos: ${error.message}`);
  }
}

async function createOrUpdateTodo(event) {
  event.preventDefault();
  const payload = {
    ...(editingTodoId !== null ? { id: editingTodoId } : {}),
    title: elements.title.value.trim(),
    description: elements.description.value.trim(),
    isCompleted: elements.isCompleted.checked
  };

  if (!payload.title || !payload.description) {
    setStatus("Title and description are required.");
    return;
  }

  try {
    if (editingTodoId !== null) {
      await apiRequest("", {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      setStatus(`Todo #${editingTodoId} updated.`);
    } else {
      await apiRequest("/create", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setStatus("Todo created.");
    }
    resetFormMode();
    await fetchTodos();
  } catch (error) {
    setStatus(`Failed to save todo: ${error.message}`);
  }
}

async function handleTodoAction(event) {
  const button = event.target.closest("button");
  if (!button) return;

  const action = button.dataset.action;
  const id = Number(button.dataset.id);
  if (!action || Number.isNaN(id)) return;

  if (action === "edit") {
    try {
      const todo = await apiRequest(`/${id}`, { method: "GET" });
      editingTodoId = id;
      elements.title.value = todo.title || "";
      elements.description.value = todo.description || "";
      elements.isCompleted.checked = Boolean(todo.isCompleted);
      setFormMode(true);
      setStatus(`Editing todo #${id}.`);
      elements.title.focus();
    } catch (error) {
      setStatus(`Failed to load todo for edit: ${error.message}`);
    }
    return;
  }

  if (action === "delete") {
    try {
      await apiRequest(`/${id}`, { method: "DELETE" });
      setStatus(`Deleted todo #${id}.`);
      if (editingTodoId === id) {
        resetFormMode();
      }
      await fetchTodos();
    } catch (error) {
      setStatus(`Failed to delete todo: ${error.message}`);
    }
    return;
  }

  if (action === "toggle") {
    try {
      const current = await apiRequest(`/${id}`, { method: "GET" });
      const updated = {
        ...current,
        isCompleted: !Boolean(current.isCompleted)
      };
      await apiRequest("", {
        method: "PUT",
        body: JSON.stringify(updated)
      });
      setStatus(`Updated todo #${id}.`);
      await fetchTodos();
    } catch (error) {
      setStatus(`Failed to update todo: ${error.message}`);
    }
  }
}

elements.todoForm.addEventListener("submit", createOrUpdateTodo);
elements.cancelEditBtn.addEventListener("click", () => {
  resetFormMode();
  setStatus("Edit cancelled.");
});
elements.refreshBtn.addEventListener("click", fetchTodos);
elements.todoList.addEventListener("click", handleTodoAction);

setFormMode(false);
fetchTodos();
