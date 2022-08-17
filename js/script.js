// untuk menjalankan kode ketika semua element HTML sudah dimuat menjadi DOM dengan baik.
document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.querySelector("#form");
  submitForm.addEventListener("submit", function (e) {
    e.preventDefault();
    addTodo();
  });

  // untuk menambahkan user
  function addTodo() {
    const textTodo = document.querySelector("#title").value;
    const timestamp = document.querySelector("#date").value;

    const generatedID = generateId();
    // generateTodoObject untuk membuat object baru
    const todoObject = generateTodoObject(generatedID, textTodo, timestamp, false);
    // push to array todos
    todos.push(todoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  // untuk membuat id unik
  function generateId() {
    return +new Date();
  }

  // untuk membuat object baru
  function generateTodoObject(id, task, timestamp, isCompleted) {
    return {
      id,
      task,
      timestamp,
      isCompleted,
    };
  }

  // menampung data-data Todo user
  const todos = [];
  // untuk memperbarui data yang ditampilkan.
  const RENDER_EVENT = "render-todo";

  document.addEventListener(RENDER_EVENT, function () {
    const uncompletedTODOList = document.getElementById("todos");
    // Agar tidak terjadi duplikasi oleh item yang ada di tampilan ketika memperbarui data
    uncompletedTODOList.innerHTML = "";

    const completedTODOList = document.getElementById("completedTodos");
    // Agar tidak terjadi duplikasi oleh item yang ada di tampilan ketika memperbarui data
    completedTODOList.innerHTML = "";

    // setiap perulangan yang dilakukan akan membuat satu elemen DOM dari function makeTodo
    for (const todoItem of todos) {
      const todoElement = makeTodo(todoItem);
      // jika todoItem false
      if (!todoItem.isCompleted) {
        // kalau todo belum selesai
        uncompletedTODOList.append(todoElement);
      } else {
        // kalau todo sudah selesai
        completedTODOList.append(todoElement);
      }
    }
  });

  function makeTodo(todoObject) {
    const textTitle = document.createElement("h2");
    textTitle.innerText = todoObject.task;

    const textTimestamp = document.createElement("p");
    textTimestamp.innerText = todoObject.timestamp;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner");
    // append() agar var textTitle dan textTimestamp menjadi child element dari textContainer
    textContainer.append(textTitle, textTimestamp);

    const container = document.createElement("div");
    container.classList.add("item", "shadow");
    container.append(textContainer);
    container.setAttribute("id", `todo-${todoObject.id}`);

    // fungsi ketika menghapus todo
    function removeTaskFromCompleted(todoId) {
      const todoTarget = findTodoIndex(todoId);

      // kalau todo id tidak ada
      if (todoTarget === -1) return;

      // kalau ada, gunakan splice untuk menghapus todos
      todos.splice(todoTarget, 1);
      document.dispatchEvent(new Event(RENDER_EVENT));
    }

    // fungsi ketika merepeat todo
    function undoTaskFromCompleted(todoId) {
      const todoTarget = findTodo(todoId);

      if (todoTarget == null) return;

      todoTarget.isCompleted = false;
      document.dispatchEvent(new Event(RENDER_EVENT));
    }

    // melakukan pengecekan
    if (todoObject.isCompleted) {
      const undoButton = document.createElement("button");
      undoButton.classList.add("undo-button");

      undoButton.addEventListener("click", function () {
        undoTaskFromCompleted(todoObject.id);
      });

      const trashButton = document.createElement("button");
      trashButton.classList.add("trash-button");

      trashButton.addEventListener("click", function () {
        removeTaskFromCompleted(todoObject.id);
      });

      // menjadi child element dari container
      container.append(undoButton, trashButton);
    } else {
      const checkButton = document.createElement("button");
      checkButton.classList.add("check-button");

      checkButton.addEventListener("click", function () {
        addTaskToCompleted(todoObject.id);
      });

      container.append(checkButton);
    }

    // agar check button bisa berfungsi
    function addTaskToCompleted(todoId) {
      // mencari todo id
      const todoTarget = findTodo(todoId);

      if (todoTarget == null) return;

      // kalau todoTarget tidak null, rubah state isCompleted dari false menjadi true
      todoTarget.isCompleted = true;
      // kalau true, perbarui data yang ditampilkan
      document.dispatchEvent(new Event(RENDER_EVENT));
    }

    // berfungsi untuk mencari todo dengan ID yang sesuai pada array todos
    function findTodo(todoId) {
      for (const todoItem of todos) {
        if (todoItem.id === todoId) {
          return todoItem;
        }
      }
      return null;
    }

    function findTodoIndex(todoId) {
      for (const index in todos) {
        if (todos[index].id === todoId) {
          return index;
        }
      }

      return -1;
    }

    return container;
  }
});
