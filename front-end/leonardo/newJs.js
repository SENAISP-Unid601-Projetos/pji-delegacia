getAllOcorrencias()
async function getAllOcorrencias() {
  const response = await axios.get('http://127.0.0.1:8080/ocorrencia/listar')

  const dados = response.data

  createCardOcorrencia(dados)
}

function createCardOcorrencia(dados) {
  const containCards = document.querySelector('.ocorrencias-div')

  dados.forEach((ocorrencia) => {
    const { id, observacoes, statusOcorrencia, dataCriacao, dataAtualizacao, agente } = ocorrencia
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
    `
  })
}

function selectColorStatusOcorrencia(statusOcorrencia) {
  if (statusOcorrencia == 'Pendente') {
    return 'background-orange-indicator'
  } else if (statusOcorrencia == 'Concluído') {
    return 'background-green-indicator'
  } else if (statusOcorrencia == 'Em Andamento') {
    return 'background-yellow-indicator'
  }
}

async function adicionarAgente(dadosAgente) {
  const resposta = await axios.post('http://localhost:8080/pessoa/adicionar', {
    nome: dadosAgente.nome,
    cpf: dadosAgente.cpf,
    rg: dadosAgente.rg,
  })

  let idPessoa = resposta.data.id

  const resposta1 = await axios.post('http://localhost:8080/agente/adicionar', {
    pessoa: {
      id: idPessoa,
    },
    departamento: dadosAgente.departamento,
  })
}
