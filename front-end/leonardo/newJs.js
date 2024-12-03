getAllOcorrencias();
async function getAllOcorrencias() {
  const response = await axios.get("http://127.0.0.1:8080/ocorrencia/listar");

  const dados = response.data;

  createCardOcorrencia(dados);
}

function createCardOcorrencia(dados) {
  const containCards = document.querySelector(".ocorrencias-div");

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
          <h3>Ocorrência / ${id}</h3>
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
        <button class="btn-ocorrencia delete">Deletar</button>
        <button class="btn-ocorrencia status">Atualizar Status</button>
      </div>
    `;
  });
}

function selectColorStatusOcorrencia(statusOcorrencia) {
  if (statusOcorrencia == "Pendente") {
    return "background-orange-indicator";
  } else if (statusOcorrencia == "Concluído") {
    return "background-green-indicator";
  } else if (statusOcorrencia == "Em Andamento") {
    return "background-yellow-indicator";
  }
}


function openOcorrenciaMod() {
  const modal = document.querySelector(".contain-form-modal-ocorrencia");
  const background = document.querySelector(".background-open-modalOcorrencia");

  modal.style.display = "block";
  background.style.display = "block";

  carregarAgentes();
}

async function carregarAgentes() {
  const selectAgente = document.getElementById('agente');

  try {
      const response = await fetch('http://localhost:8080/agente/listar');
      if (!response.ok) {
          throw new Error(`Erro ao carregar agentes: ${response.statusText}`);
      }

      const agentes = await response.json();

      // Limpa o conteúdo do <select> antes de popular
      selectAgente.innerHTML = '';

      // Adiciona uma opção padrão
      const opcaoPadrao = document.createElement('option');
      opcaoPadrao.value = '';
      opcaoPadrao.textContent = 'Selecione um agente';
      opcaoPadrao.disabled = true;
      opcaoPadrao.selected = true;
      selectAgente.appendChild(opcaoPadrao);

      // Popula o <select> com os dados dos agentes
      agentes.forEach(agente => {
          const opcao = document.createElement('option');
          opcao.value = agente.id;
          opcao.textContent = agente.pessoa.nome; // Utiliza o nome da pessoa
          selectAgente.appendChild(opcao);
      });
  } catch (error) {
      console.error('Erro ao carregar agentes:', error);
  }
}

function closeOcorrenciaMod() {
  const modal = document.querySelector(".contain-form-modal-ocorrencia");
  const background = document.querySelector(".background-open-modalOcorrencia");

  modal.style.display = "none";
  background.style.display = "none";
}


document.getElementById("formAddOcorrencia").addEventListener("submit", async (e) => {
  e.preventDefault();

  const observacoes = document.getElementById("observacoes").value;
  const statusOcorrencia = document.getElementById("statusOcorrencia").value;
  const agenteNome = document.getElementById("agente").value;

  const response = await axios.post("http://localhost:8080/ocorrencia/adicionar", {
    observacoes,
    statusOcorrencia,
    agente: { pessoa: { nome: agenteNome } },
  });

  const novaOcorrencia = response.data;

  const containCards = document.querySelector(".ocorrencias-div");
  const {
    id,
    observacoes: novaObservacao,
    statusOcorrencia: novoStatus,
    dataCriacao,
    dataAtualizacao,
    agente,
  } = novaOcorrencia;

  containCards.innerHTML += `
    <div class="ocorrencia" data-id="${id}">
      <div class="contain-header-ocorrencia">
        <h3>Ocorrência / ${id}</h3>
        <div class="contain-indicator-status-ocorrencia">
          <div class="indicador-status-ocorrencia ${selectColorStatusOcorrencia(novoStatus)}"></div>
        </div>
      </div>
      <p>Status: ${novoStatus}</p>
      <p>Observações: ${novaObservacao}</p>
      <p>Data de Criação: ${dataCriacao}</p>
      <p>Ultima Atualização: ${dataAtualizacao}</p>
      <p>Agente: ${agente.pessoa.nome}</p>
      <button class="btn-ocorrencia">Editar</button>
      <button class="btn-ocorrencia delete">Deletar</button>
      <button class="btn-ocorrencia status">Atualizar Status</button>
    </div>
  `;

  
  closeOcorrenciaMod();

  
  e.target.reset();
});


getAllOcorrencias();
async function getAllOcorrencias() {
  const response = await axios.get("http://localhost:8080/ocorrencia/listar");
  const dados = response.data;

  createCardOcorrencia(dados);
}


function createCardOcorrencia(dados) {
  const containCards = document.querySelector(".ocorrencias-div");

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
          <h3>Ocorrência / ${id}</h3>
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
        <button class="btn-ocorrencia delete">Deletar</button>
        <button class="btn-ocorrencia status">Atualizar Status</button>
      </div>
    `;
  });
}


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


function openListaAgenteModal() {
  const listaAgenteMod = document.querySelector(".contain-form-modal-lista");
  const backGroudModal = document.querySelector(".background-open-modalListaAgente");

  if (listaAgenteMod.style.display === "none" || listaAgenteMod.style.display === "") {
    listaAgenteMod.style.display = "block"; // Mostra o modal
    backGroudModal.style.display = "block"; // Ativa o fundo escuro
    listarAgentes(); // Lista os agentes
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






