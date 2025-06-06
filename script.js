const taskList = document.getElementById("task-list");
const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const filterAllBtn = document.getElementById("filter-all");
const filterCompletedBtn = document.getElementById("filter-completed");
const deleteAllBtn = document.getElementById("delete-all-btn");

deleteAllBtn.addEventListener("click", () => {
  if (confirm("هل أنت متأكد من حذف جميع المهام؟")) {
    tasks = [];
    saveTasks();
    showTasks();
  }
});

let tasks = [];
let filter = "all";

function loadTasks() {
  const storedTasks = localStorage.getItem("tasks");
  tasks = storedTasks ? JSON.parse(storedTasks) : [];
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showTasks() {
  taskList.innerHTML = "";
  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((task) => task.completed);
  if (filteredTasks.length === 0) {
    taskList.innerHTML = `<li class="list-group-item text-center" style="width:90%;">${
      filter === "all" ? "لا توجد مهام" : "لا توجد مهام منجزة"
    }</li>`;
    return;
  }
  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";
    li.style = "width:90%";
    li.dataset.id = task.id;

    const textSpan = document.createElement("span");
    textSpan.className = "task-text";
    textSpan.textContent = task.text;
    if (task.completed) textSpan.classList.add("text-decoration-line-through");

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-sm btn-danger";
    deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';

    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-sm btn-primary ms-2";
    editBtn.innerHTML = '<i class="bi bi-pencil"></i>';

    const completeBtn = document.createElement("button");
    completeBtn.className = "btn btn-sm btn-success ms-2";
    completeBtn.innerHTML = '<i class="bi bi-check"></i>';

    li.appendChild(textSpan);
    li.appendChild(completeBtn);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

addBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (text) {
    const newTask = { id: Date.now(), text, completed: false };
    tasks.push(newTask);
    saveTasks();
    showTasks();
    taskInput.value = "";
  }
});

filterAllBtn.addEventListener("click", () => {
  filter = "all";
  showTasks();
  filterAllBtn.classList.add("active");
  filterCompletedBtn.classList.remove("active");
});

filterCompletedBtn.addEventListener("click", () => {
  filter = "completed";
  showTasks();
  filterCompletedBtn.classList.add("active");
  filterAllBtn.classList.remove("active");
});

taskList.addEventListener("click", (e) => {
  const li = e.target.closest(".task-item");
  if (!li) return;
  const id = parseInt(li.dataset.id);
  const task = tasks.find((task) => task.id === id);

  if (e.target.closest(".btn-danger")) {
    if (confirm("هل أنت متأكد من حذف هذه المهمة؟")) {
      tasks = tasks.filter((task) => task.id !== id);
      saveTasks();
      showTasks();
    }
  } else if (e.target.closest(".btn-primary")) {
    const newText = prompt("أكتب العنوان الجديد للمهمة", task.text);
    if (newText !== null && newText.trim() !== "") {
      task.text = newText.trim();
      saveTasks();
      showTasks();
    }
  } else if (e.target.closest(".btn-success")) {
    task.completed = !task.completed;
    saveTasks();
    showTasks();
  }
});

loadTasks();
showTasks();
