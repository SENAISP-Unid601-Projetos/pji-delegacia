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
          <h3>Ocorrência ${id}</h3>
          <div class="contain-indicator-status-ocorrencia">
            <div class="indicador-status-ocorrencia ${selectColorStatusOcorrencia(
              statusOcorrencia
            )}"></div>
          </div>
        </div>
        <p>Status: ${statusOcorrencia}</p>
        <p>Observações: ${observacoes}</p>
        <p>Data de Criação: ${dataCriacao}</p>
        <p>Última Atualização: ${dataAtualizacao}</p>
        <p>Agente: ${agente.pessoa.nome}</p>
        <button class="btn-ocorrencia">Editar</button>
        <button class="btn-ocorrencia-delete" onclick="deletarOcorrencia(${id})">Deletar</button>
        <button class="btn-ocorrencia-status">Atualizar Status</button>
      </div>
    `;
  });
}

function deletarOcorrencia(id) {
  const confirmar = confirm("Tem certeza de que deseja deletar esta ocorrência?");
  if (confirmar) {
    fetch(`http://127.0.0.1:8080/ocorrencia/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao deletar a ocorrência.");
        }
        return response.json();
      })
      .then(() => {
        const ocorrenciaDiv = document.querySelector(`.ocorrencia[data-id="${id}"]`);
        ocorrenciaDiv.remove();
        alert("Ocorrência deletada com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao deletar:", error);
        alert("Erro ao deletar a ocorrência. Tente novamente.");
      });
  }
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

function openOcorrenciaModal() {
  let ocorrenciaMod = document.querySelector(".contain-form-modal-ocorrencia");
  let backGroudModal = document.querySelector(".background-open-modalAgente");

  if (ocorrenciaMod.style.display == "none" || ocorrenciaMod.style.display == "") {
    ocorrenciaMod.style.display = "flex";
    backGroudModal.style.display = "block";
  } else {
    backGroudModal.style.display = "none";
    ocorrenciaMod.style.display = "none";
  }
  listarAgentes();
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
