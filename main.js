let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let input = document.getElementById("task-input");
let addBtn = document.getElementById("create-task");
let taskList = document.querySelector(".task-list");
let deleteAllTask = document.getElementById("delete-allTask");

function updateLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function setupUI(task) {
  let li = document.createElement("li");

  let p = document.createElement("p");
  p.textContent = task.name;

  let btnsDiv = document.createElement("div");
  btnsDiv.className = "task-btns";

  let completeBtn = document.createElement("button");
  completeBtn.className = "btn btn-success";
  completeBtn.innerHTML = "✅";

  completeBtn.addEventListener("click", () => {
    li.classList.toggle("complete");

    updateLocalStorage();
  });

  let updateBtn = document.createElement("button");
  updateBtn.className = "btn btn-warning";
  updateBtn.innerHTML = "✏️";

  let deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-danger";
  deleteBtn.innerHTML = "🗑️";

  updateBtn.addEventListener("click", () => {
    let newName = prompt("اكتب المهمة الجديدة:", task.name);
    if (newName && newName.trim()) {
      updateTask(task.id, newName, p);
    }
  });

  deleteBtn.addEventListener("click", () => deleteTask(task.id, li));

  btnsDiv.append(completeBtn, updateBtn, deleteBtn);
  li.append(p, btnsDiv);
  taskList.appendChild(li);
}
async function createTask(name) {
  try {
    let res = await fetch(
      "https://68219a1b259dad2655afc217.mockapi.io/api/Todo",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, completed: false }),
      }
    );
    let data = await res.json();
    tasks.push(data);
    setupUI(data);
    updateLocalStorage();
  } catch (err) {
    console.error("خطأ أثناء إنشاء المهمة:", err);
  }
}

async function deleteTask(id, liElement) {
  if (!confirm("هل أنت متأكد من الحذف؟")) return;
  try {
    await fetch(`https://68219a1b259dad2655afc217.mockapi.io/api/Todo/${id}`, {
      method: "DELETE",
    });
    tasks = tasks.filter((task) => task.id !== id);
    liElement.remove();
    updateLocalStorage();
  } catch (err) {
    console.error("خطأ أثناء الحذف:", err);
  }
}

async function updateTask(id, newName, pElement) {
  try {
    let res = await fetch(
      `https://68219a1b259dad2655afc217.mockapi.io/api/Todo/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      }
    );
    let data = await res.json();
    pElement.textContent = data.name;
    tasks = tasks.map((task) => (task.id === id ? data : task));
    updateLocalStorage();
  } catch (err) {
    console.error("خطأ أثناء التحديث:", err);
  }
}

async function loadTasks() {
  try {
    let res = await fetch(
      "https://68219a1b259dad2655afc217.mockapi.io/api/Todo"
    );
    tasks = await res.json();
    tasks.forEach(setupUI);
      updateLocalStorage();
  } catch (err) {
    console.error("فشل في تحميل المهام:", err);
  }
}

async function deleteAllTasksFromAPI() {
  if (tasks.length === 0) {
    alert("لا توجد مهام لحذفها.");
    return;
  }
  if (!confirm("هل تريد حذف جميع المهام؟")) return;
  try {
    for (let task of tasks) {
      await fetch(
        `https://68219a1b259dad2655afc217.mockapi.io/api/Todo/${task.id}`,
        {
          method: "DELETE",
        }
      );
    }
    tasks = [];
    taskList.innerHTML = "";
    updateLocalStorage();
  } catch (err) {
    console.error("فشل حذف الكل:", err);
  }
}

addBtn.addEventListener("click", () => {
  let taskName = input.value.trim();
  if (taskName) {
    createTask(taskName);
    input.value = "";
  }
});

deleteAllTask.addEventListener("click", deleteAllTasksFromAPI);

window.addEventListener("DOMContentLoaded", loadTasks);
