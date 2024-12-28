const baseURL = "YOUR_GLITCH_URL";

// Signup
if (document.getElementById("signupForm")) {
  document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`${baseURL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) alert("Signup successful!");
  });
}

// Login
if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const response = await fetch(`${baseURL}/users?email=${email}&password=${password}`);
    const users = await response.json();

    if (users.length > 0) {
      localStorage.setItem("user", JSON.stringify(users[0]));
      window.location.href = "todos.html";
    } else {
      alert("Invalid credentials!");
    }
  });
}

// Todos
if (document.getElementById("todoForm")) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) window.location.href = "login.html";

  const fetchTodos = async () => {
    const response = await fetch(`${baseURL}/todos?userId=${user.id}`);
    const todos = await response.json();
    const todoList = document.getElementById("todoList");
    todoList.innerHTML = todos
      .map(
        (todo) => `<li>${todo.text} <button onclick="deleteTodo(${todo.id})">Delete</button></li>`
      )
      .join("");
  };

  document.getElementById("todoForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = document.getElementById("todoText").value;

    await fetch(`${baseURL}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, userId: user.id })
    });

    fetchTodos();
  });

  window.deleteTodo = async (id) => {
    await fetch(`${baseURL}/todos/${id}`, { method: "DELETE" });
    fetchTodos();
  };

  fetchTodos();
}
