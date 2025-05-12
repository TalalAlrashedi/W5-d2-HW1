const input = document.getElementById("task-input");
const addBtn = document.getElementById("create-task");
const taskList = document.querySelector(".task-list");
let deleteAllTask = document.getElementById("delete-allTask")



function appendTaskToUI(task) {
  const li = document.createElement("li");

  const p = document.createElement("p");
  p.textContent = task.name;

  const btnsDiv = document.createElement("div");
  btnsDiv.className = "task-btns";

  const completeBtn = document.createElement("button");
  completeBtn.className = "btn btn-success";
  completeBtn.innerHTML = "✅";

  const updateBtn = document.createElement("button");
  updateBtn.className = "btn btn-warning";
  updateBtn.innerHTML = "✏️";

  updateBtn.addEventListener("click", () => {
    const newName = prompt("اكتب المهمة الجديدة:", task.name);
    if (newName && newName.trim()) {
      updateTask(task.id, newName, p);
    }
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-danger";
  deleteBtn.innerHTML = "🗑️";

  deleteBtn.addEventListener("click", () => deleteTask(task.id, li));

  btnsDiv.appendChild(completeBtn);
  btnsDiv.appendChild(updateBtn);
  btnsDiv.appendChild(deleteBtn);

  li.appendChild(p);
  li.appendChild(btnsDiv);
  taskList.appendChild(li);
}

async function createTask(name) {
  try {
    const res = await fetch(
      "https://68219a1b259dad2655afc217.mockapi.io/api/Todo",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      }
    );
    const data = await res.json();
    appendTaskToUI(data);
  } catch (err) {
    console.log("حدث خطأ أثناء إضافة المهمة");
    console.error(err);
  }
}

async function deleteTask(id, liElement) {
  try {
    let isConfirm = confirm("هل انت متاكد من حذف المهمة ؟");
    if (!isConfirm) return;

    await fetch(`https://68219a1b259dad2655afc217.mockapi.io/api/Todo/${id}`, {
      method: "DELETE",
    });

    liElement.remove();
  } catch (err) {
    console.error("خطأ أثناء الحذف:", err);
  }
}

async function loadTasks() {
  try {
    const res = await fetch(
      "https://68219a1b259dad2655afc217.mockapi.io/api/Todo"
    );
    const tasks = await res.json();
    tasks.forEach((task) => appendTaskToUI(task));
  } catch (err) {
    console.error("فشل تحميل المهام:", err);
  }
}
async function updateTask(id, newName, pElement) {
  try {
    const res = await fetch(
      `https://68219a1b259dad2655afc217.mockapi.io/api/Todo/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      }
    );
    const data = await res.json();
    pElement.textContent = data.name;
  } catch (err) {
    console.error("فشل التحديث:", err);
  }
}



addBtn.addEventListener("click", () => {
  const taskName = input.value.trim();
  if (taskName) {
    createTask(taskName);
    input.value = "";
  }
});

window.addEventListener("DOMContentLoaded", loadTasks);
