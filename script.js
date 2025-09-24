
// =============================
// BOAS-VINDAS AO USUÁRIO
// =============================

let user = localStorage.getItem("userName"); // tenta pegar do LocalStorage
if (!user) {
  const params = new URLSearchParams(window.location.search);
  user = params.get("user"); // tenta pegar da URL
}
if (user) {
  document.getElementById("welcome").textContent = `Bem-vindo(a), ${decodeURIComponent(user)}!`;
}

// =============================
// VARIÁVEIS GLOBAIS
// =============================

const input = document.getElementById("tarefa");
const addBt = document.getElementById("addBt");
const rmvBt = document.getElementById("rmvBt");
const clBt = document.getElementById("clBt");
const lista = document.getElementById("task-list");
const toast = document.getElementById("toast");

// =============================
// INICIALIZAÇÃO
// =============================

document.addEventListener("DOMContentLoaded", carregarTarefas);

// =============================
// EVENTOS PRINCIPAIS
// =============================

addBt.addEventListener("click", adicionarTarefa);
input.addEventListener("keypress", (e) => { if (e.key === "Enter") adicionarTarefa(); });
rmvBt.addEventListener("click", removerConcluidas);
clBt.addEventListener("click", limparTudo);

// =============================
// FUNÇÃO: Adicionar tarefa
// =============================

function adicionarTarefa() {
  const texto = input.value.trim();
  if (!texto) {
    showToast("Digite uma tarefa primeiro!");
    return;
  }

  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.addEventListener("change", () => {
    li.classList.toggle("completed", checkbox.checked);
    salvarTarefas();
  });

  const span = document.createElement("span");
  span.textContent = texto;

  li.appendChild(checkbox);
  li.appendChild(span);
  lista.appendChild(li);

  input.value = "";
  salvarTarefas();
  showToast("Tarefa adicionada!");
}

// =============================
// FUNÇÃO: Remover tarefas concluídas
// =============================

function removerConcluidas() {
  const concluidas = document.querySelectorAll("#task-list li.completed");
  if (concluidas.length === 0) {
    showToast("Nenhuma tarefa concluída para remover.");
    return;
  }
  concluidas.forEach(li => li.remove());
  salvarTarefas();
  showToast("Tarefas concluídas removidas!");
}

// =============================
// FUNÇÃO: Limpar toda a lista
// =============================

function limparTudo() {
  if (lista.children.length === 0) {
    showToast("Não há tarefas para limpar.");
    return;
  }
  lista.innerHTML = "";
  salvarTarefas();
  showToast("Todas as tarefas foram limpas!");
}

// =============================
// FUNÇÃO: Mostrar mensagens rápidas (toast)
// =============================

function showToast(msg) {
  toast.textContent = msg;
  toast.className = "show";
  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 2000);
}

// =============================
// FUNÇÃO: Salvar tarefas no LocalStorage
// =============================

function salvarTarefas() {
  const tarefas = [];
  document.querySelectorAll("#task-list li").forEach(li => {
    const texto = li.querySelector("span").textContent;
    const concluida = li.classList.contains("completed");
    tarefas.push({ texto, concluida });
  });
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// =============================
// FUNÇÃO: Carregar tarefas do LocalStorage
// =============================

function carregarTarefas() {
  const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
  tarefas.forEach(t => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = t.concluida;
    if (t.concluida) li.classList.add("completed");
    checkbox.addEventListener("change", () => {
      li.classList.toggle("completed", checkbox.checked);
      salvarTarefas();
    });

    const span = document.createElement("span");
    span.textContent = t.texto;

    li.appendChild(checkbox);
    li.appendChild(span);
    lista.appendChild(li);
  });
}
