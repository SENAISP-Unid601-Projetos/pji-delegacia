getAllOcorrencias();
async function getAllOcorrencias() {
  const response = await axios.get("http://127.0.0.1:8080/ocorrencia/listar");

  const dados = response.data;

  createCardOcorrencia(dados);
}

function createCardOcorrencia(dados) {
  const containCards = document.querySelector(".ocorrencias-div");
  containCards.innerHTML = "";

  dados.forEach((ocorrencia) => {
    const {
      id,
      observacoes,
      statusOcorrencia,
      dataCriacao,
      dataAtualizacao,
      agente,
    } = ocorrencia;

    containCards.innerHTML += `
      <div class="ocorrencia" data-id="${id}">
        <div class="contain-header-ocorrencia">
          <h3>Ocorrência  ${id}</h3>
          <div class="contain-indicator-status-ocorrencia">
            <div class="indicador-status-ocorrencia ${selectColorStatusOcorrencia(
      statusOcorrencia
    )}"></div>
          </div>
        </div>
        <p>Status: ${statusOcorrencia}</p>
        <p>Observações: ${observacoes}</p>
        <p>Data de Criação: ${dataCriacao}</p>
        <p>Ultima Atualização: ${dataAtualizacao}</p>
        <p>Agente: ${agente.pessoa.nome}</p>
        <button class="btn-ocorrencia">Editar</button>
        <button class="btn-ocorrencia-delete">Deletar</button>
        <button class="btn-ocorrencia-status">Atualizar Status</button>
      </div>
    `;
  });
}

document.getElementById("form-ocorrencia").addEventListener("submit", async function (event) {
  event.preventDefault(); // Evita o recarregamento da página

  const descricao = document.querySelector("#descricao").value;
  const statusOcorrencia = document.querySelector("#statusOcorrencia").value;
  const agenteId = document.getElementById("agenteSelecionado").dataset.id;

  if (!agenteId) {
    alert("Por favor, selecione um agente.");
    return;
  }

  await axios.post("http://127.0.0.1:8080/ocorrencia/adicionar", {
    observacoes: descricao,
    statusOcorrencia: statusOcorrencia,
    agente: { id: agenteId },
  });

  alert("Ocorrência adicionada com sucesso!");
  getAllOcorrencias(); // Atualiza a lista de ocorrências
  openOcorrenciaModal(); // Fecha o modal de ocorrências
});



function selectColorStatusOcorrencia(statusOcorrencia) {
  if (statusOcorrencia == "Pendente") {
    return "background-orange-indicator";
  } else if (statusOcorrencia == "Concluído") {
    return "background-green-indicator";
  } else if (statusOcorrencia == "Em Andamento") {
    return "background-yellow-indicator";
  }
}


function inputAgente() {
  const nomeAgente = document.querySelector("#nomeAgente").value;
  const cpfAgente = document.querySelector("#cpfAgente").value;
  const rgAgente = document.querySelector("#rgAgente").value;
  const departamentoAgente = document.querySelector("#DepartamentoAgente").value;

  adicionarAgente(nomeAgente, cpfAgente, rgAgente, departamentoAgente);
}

async function adicionarAgente(nomeAgente, cpfAgente, rgAgente, departamentoAgente) {


  const resposta = await axios.post("http://localhost:8080/pessoa/adicionar", {
    nome: nomeAgente,
    cpf: cpfAgente,
    rg: rgAgente,
  });

  let idPessoa = resposta.data.id;

  const resposta1 = await axios.post("http://localhost:8080/agente/adicionar", {
    pessoa: {
      id: idPessoa,
    },
    departamento: departamentoAgente,
  });
}


function openAgenteModal() {
  let agenteMod = document.querySelector(".contain-form-modal");
  let backGroudModal = document.querySelector(".background-open-modalAgente");

  if (agenteMod.style.display == "none" || agenteMod.style.display == "") {
    agenteMod.style.display = "flex";
    backGroudModal.style.display = "block";
  } else {
    backGroudModal.style.display = "none";
    agenteMod.style.display = "none";
  }
}

function openOcorrenciaModal() {
  let ocorrenciaMod = document.querySelector(".contain-form-modal-ocorrencia");
  let backGroudModal = document.querySelector(".background-open-modalOcorrencia");

  if (ocorrenciaMod.style.display == "none" || ocorrenciaMod.style.display == "") {
    ocorrenciaMod.style.display = "flex";
    backGroudModal.style.display = "block";
  } else {
    backGroudModal.style.display = "none";
    ocorrenciaMod.style.display = "none";
  }
}


function openListAgenteEmOcorrencia() {
  const selectAgenteMod = document.querySelector(".contain-form-modal-lista-select");
  const backGroudModal = document.querySelector(".background-open-modalListaAgenteSelect");
  const selectAgente = document.getElementById("modalAgente");

  document.body.style.overflowY = "hidden"
  // Garante que nenhum outro modal esteja visível
  selectAgente.style.display = "none"; // Fecha o modal de agentes se estiver aberto
  selectAgenteMod.style.display = "none"; // Fecha qualquer outra lista
  backGroudModal.style.display = "block"; // Fecha o fundo escuro

  // Agora abre o modal de seleção de agentes
  selectAgenteMod.style.display = "block";
  backGroudModal.style.display = "none";

  // Chama a função para listar os agentes
  listAgenteEmOcorrencia();
}

async function listAgenteEmOcorrencia() {
  const modal = document.getElementById("modalAgente");
  const tabela = document.querySelector("#tabelaAgentes tbody");

  // Limpa a tabela antes de adicionar os agentes
  tabela.innerHTML = "";

  // Faz a requisição para obter a lista de agentes
  const response = await axios.get("http://127.0.0.1:8080/agente/listar");
  const agentes = response.data;

  // Preenche a tabela com os agentes
  agentes.forEach((agente) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${agente.id}</td>
      <td>${agente.pessoa.nome}</td>
      <td>${agente.departamento}</td>
      <td>
        <button onclick="selecionarAgente(${agente.id}, '${agente.pessoa.nome}')">
          Selecionar
        </button>
      </td>
    `;
    tabela.appendChild(row);
  });

  // Exibe o modal
  modal.style.display = "block";
}


// Vincular o agente selecionado ao formulário de ocorrência
function selecionarAgente(id, nome) {
  // Exibe o agente selecionado no formulário
  const agenteSelecionado = document.getElementById("agenteSelecionado");
  agenteSelecionado.textContent = `Agente Selecionado: ${nome}`;
  agenteSelecionado.dataset.id = id;

  // Fecha o modal
  fecharModalAgente();
}

// Fechar o modal de seleção de agentes
function fecharModalAgente() {
  const modal = document.getElementById("modalAgente");
  modal.style.display = "none";
  const listaAgenteMod = document.querySelector(".contain-form-modal-lista-select");
  listaAgenteMod.style.display = "none";
  const backGroudModal = document.querySelector(".background-open-modalListaAgente");
  backGroudModal.style.display = "none";
}


function openListaAgenteModal() {
  const listaAgenteMod = document.querySelector(".contain-form-modal-lista");
  const backGroudModal = document.querySelector(".background-open-modalListaAgente");

  if (listaAgenteMod.style.display === "none" || listaAgenteMod.style.display === "") {
    listaAgenteMod.style.display = "block"; // Mostra o modal
    backGroudModal.style.display = "block"; // Ativa o fundo escuro
    listarAgentes(); // chama a função para listar os agentes
  } else {
    listaAgenteMod.style.display = "none"; // Esconde o modal
    backGroudModal.style.display = "none"; // Esconde o fundo escuro
  }
}

async function listarAgentes() {

  const response = await axios.get("http://localhost:8080/agente/listar");
  const agentes = response.data;

  const tabelaCorpo = document.querySelector("#tabela-corpo");
  tabelaCorpo.innerHTML = ""; // Limpa a tabela antes de adicionar novos dados SE TIRAR DÁ RUIM

  agentes.forEach((agente) => {
    const { pessoa, departamento } = agente;

    // Criação das linhas da tabela
    const linhaHTML = `
      <tr>
        <td>${pessoa.nome}</td>
        <td>${pessoa.cpf}</td>
        <td>${departamento}</td>
      </tr>
    `;
    //adicionar mais um <td>button para deletear os agents</td>

    tabelaCorpo.innerHTML += linhaHTML; // Adiciona a linha à tabela
  });

}

