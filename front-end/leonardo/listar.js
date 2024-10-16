async function listar() {
  try {
    const resultadoLista = await axios.get(
      "http://localhost:8080/ocorrencia/listar"
    );

    const ocorrencias = resultadoLista.data;
    console.log(ocorrencias);
    const ocorrenciasDiv = document.querySelector(".ocorrencias-div");
    ocorrenciasDiv.innerHTML = ""; // Limpa antes de adicionar

    ocorrencias.forEach((ocorrencia) => {
      const ocorrenciaDiv = document.createElement("div");
      ocorrenciaDiv.classList.add("ocorrencia");

      const titulo = document.createElement("h3");
      titulo.textContent = `Ocorrência #${ocorrencia.id}`;

      const descricao = document.createElement("p");
      descricao.textContent = `Descrição: ${ocorrencia.observacoes}`;

      const agente = document.createElement("p");
      agente.textContent = `Agente: ${ocorrencia.agente.nome}`;

      ocorrenciaDiv.appendChild(titulo);
      ocorrenciaDiv.appendChild(descricao);
      ocorrenciaDiv.appendChild(agente);

      const statusOcorrencia = ocorrencia.statusOcorrencia;

      // Adiciona evento de clique para abrir o modal
      console.log("teste");
      ocorrenciaDiv.addEventListener("click", () => abrirModal(ocorrencia));

      ocorrenciasDiv.appendChild(ocorrenciaDiv);
    });
  } catch (error) {
    console.error("Erro ao buscar ocorrências:", error);
  }
}

// Função para abrir o modal e preencher os dados
function abrirModal(ocorrencia) {
  const modal = document.getElementById("modalOcorrencia");
  const modalTitulo = document.getElementById("modalTitulo");
  const modalDescricao = document.getElementById("modalDescricao");
  const modalAgente = document.getElementById("modalAgente");

  modalTitulo.textContent = `Ocorrência #${ocorrencia.id}`;
  modalDescricao.textContent = `Descrição: ${ocorrencia.observacoes}`;
  modalAgente.textContent = `Agente: ${ocorrencia.agente.nome}`;

  // Exibe o modal
  modal.style.display = "block"; //Display no css estará NONE para que ele fique invísivel e só abra quando eu mudar aq no js

  // Fecha o modal quando clicar no "X"
  document.querySelector(".close").onclick = function () {
    modal.style.display = "none";
  };

  // Fecha o modal quando clicar fora da área de conteúdo
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}

async function enviarDados(dados) {
  try {
    const resposta = await fetch("http://localhost:8080/agente/adicionar", {
      method: "POST", // post server para adicionar os dados se quiser editar dados existentes ja eu adiciono o put
      headers: {
        //objeto utilizado para definir cabeçalho
        "Content-Type": "application/json", //informar ao servidor que esta em formato json
      },
      body: JSON.stringify(dados), //enviando os dados que Desejamos e convertendo ele para json
    });

    // Verifica se a resposta foi bem-sucedida
    if (resposta.ok) {
      const resultado = await resposta.json(); // Converte a resposta para JSON
      console.log("Dados enviados com sucesso:", resultado);
    } else {
      console.error(
        "Erro ao enviar dados:",
        resposta.status,
        resposta.statusText
      );
    }
  } catch (erro) {
    console.error("Erro na requisição:", erro);
  }
}

const dadosParaEnviar = { nome: "Nome do Agente", pessoa: { id: "1" } }; // enviar o nome do agente pro banco
// Chama a função para enviar os dados
enviarDados(dadosParaEnviar);
// Chama o método listar ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  listar();
});

async function editarOcorrencia(id, novosDados) {
  try {
    const resposta = await axios.put(
      `http://localhost:8080/ocorrencia/editar/${id}`,
      novosDados
    );
    if (resposta.status === 200) {
      console.log("Ocorrência atualizada com sucesso:", resposta.data);
      listar(); // Atualiza a lista de ocorrências após a edição
    }
  } catch (erro) {
    console.error("Erro ao editar a ocorrência:", erro);
  }
}

// Exemplo de como capturar o evento de clique no botão de editar:
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-editar")) {
    const id = event.target.getAttribute("data-id");
    const novosDados = { observacoes: "Nova descrição" }; // Pega os novos dados do modal/formulário
    editarOcorrencia(id, novosDados);
  }
});

async function deletarOcorrencia(id) {
  try {
    const resposta = await axios.delete(
      `http://localhost:8080/ocorrencia/deletar/${id}`
    );
    if (resposta.status === 200) {
      console.log("Ocorrência deletada com sucesso");
      listar(); // Atualiza a lista de ocorrências após a exclusão
    }
  } catch (erro) {
    console.error("Erro ao deletar a ocorrência:", erro);
  }
}

// Exemplo de como capturar o evento de clique no botão de deletar:
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-deletar")) {
    const id = event.target.getAttribute("data-id");
    if (confirm("Tem certeza que deseja deletar esta ocorrência?")) {
      deletarOcorrencia(id);
    }
  }
});

async function atualizarStatusOcorrencia(id, novoStatus) {
  try {
    const resposta = await axios.patch(
      `http://localhost:8080/ocorrencia/atualizarStatus/${id}`,
      {
        status: novoStatus, // Envia o novo status
      }
    );
    if (resposta.status === 200) {
      console.log("Status atualizado com sucesso:", resposta.data);
      listar(); // Atualiza a lista de ocorrências
    }
  } catch (erro) {
    console.error("Erro ao atualizar o status:", erro);
  }
}

// Exemplo de como capturar o evento de clique no botão de atualizar status:
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-atualizar-status")) {
    const id = event.target.getAttribute("data-id");
    const novoStatus = "Resolvido"; // Pode capturar o novo status de um campo ou botão
    atualizarStatusOcorrencia(id, novoStatus);
  }
});
