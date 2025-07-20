// Elementos da página
const contadorDisplay = document.getElementById("contador");
const btnIncrementar = document.getElementById("btnIncrementar");
const btnResetar = document.getElementById("btnResetar");

// Função para buscar o contador atual
async function buscarContador() {
  try {
    const response = await fetch("/api/contador");
    const data = await response.json();
    contadorDisplay.textContent = data.contador;
  } catch (error) {
    console.error("Erro ao buscar contador:", error);
    contadorDisplay.textContent = "Erro";
  }
}

// Função para incrementar o contador
async function incrementarContador() {
  try {
    btnIncrementar.disabled = true;
    btnIncrementar.textContent = "⏳ Processando...";

    const response = await fetch("/api/contador/incrementar", {
      method: "POST",
    });

    const data = await response.json();
    contadorDisplay.textContent = data.contador;

    // Animação de incremento
    contadorDisplay.style.transform = "scale(1.2)";
    setTimeout(() => {
      contadorDisplay.style.transform = "scale(1)";
    }, 200);
  } catch (error) {
    console.error("Erro ao incrementar contador:", error);
    alert("Erro ao incrementar contador!");
  } finally {
    btnIncrementar.disabled = false;
    btnIncrementar.textContent = "👆 Clique Aqui!";
  }
}

// Função para resetar o contador
async function resetarContador() {
  if (!confirm("Tem certeza que deseja resetar o contador?")) {
    return;
  }

  try {
    btnResetar.disabled = true;
    btnResetar.textContent = "⏳ Resetando...";

    const response = await fetch("/api/contador", {
      method: "DELETE",
    });

    const data = await response.json();
    contadorDisplay.textContent = data.contador;

    alert(data.mensagem);
  } catch (error) {
    console.error("Erro ao resetar contador:", error);
    alert("Erro ao resetar contador!");
  } finally {
    btnResetar.disabled = false;
    btnResetar.textContent = "🔄 Resetar";
  }
}

// Event listeners
btnIncrementar.addEventListener("click", incrementarContador);
btnResetar.addEventListener("click", resetarContador);

// Carregar contador inicial quando a página carregar
document.addEventListener("DOMContentLoaded", buscarContador);

// Atualizar contador a cada 5 segundos (para ver mudanças de outros usuários)
setInterval(buscarContador, 5000);
