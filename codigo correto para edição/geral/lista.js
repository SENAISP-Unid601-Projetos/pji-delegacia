getAllOcorrencias()
async function getAllOcorrencias() {
  const response = await axios.get('http://localhost:8080/ocorrencia/listar')

  const dados = response.data

  createCardOcorrencia(dados)
}

function createCardOcorrencia(dados) {
  const containCards = document.querySelector('.ocorrencias-div')
  containCards.innerHTML = ''

  dados.forEach((ocorrencia) => {
    const {
      id,
      observacoes,
      statusOcorrencia,
      dataCriacao,
      dataAtualizacao,
      agente,
    } = ocorrencia

    console.log(statusOcorrencia)
    containCards.innerHTML += `
      <div class="ocorrencia" data-id="${id}">
        <div class="contain-header-ocorrencia">
          <h3>Ocorrência${id}</h3>
          <div class="contain-indicator-status-ocorrencia">
            <div class="bolinha-status ${selectColorStatusOcorrencia(
              statusOcorrencia
            )}"></div>
          </div>
        </div>
        <p>Status: 
          <select onChange="alterarStatusOcorrencia(this)">
            <option value="Pendente" ${
              statusOcorrencia == 'Pendente' ? 'selected' : ''
            }>Pendente</option>
            <option value="Em Andamento" ${
              statusOcorrencia == 'Em Andamento' ? 'selected' : ''
            }>Em Andamento</option>
            <option value="Finalizado" ${
              statusOcorrencia == 'Finalizado' ? 'selected' : ''
            }>Finalizado</option>
          </select>
        </p>
        <p>Observações: ${observacoes}</p>
        <p>Data de Criação: ${dataCriacao}</p>
        <p>Ultima Atualização: ${
          dataAtualizacao == null ? '' : dataAtualizacao
        }</p>
        <p>Agente: ${agente.pessoa.nome}</p>
        
        <button class="btn-ocorrencia-delete" onclick="deletarOcorrencia(${id})"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZjAwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS10cmFzaC0yIj48cGF0aCBkPSJNMyA2aDE4Ii8+PHBhdGggZD0iTTE5IDZ2MTRjMCAxLTEgMi0yIDJIN2MtMSAwLTItMS0yLTJWNiIvPjxwYXRoIGQ9Ik04IDZWNGMwLTEgMS0yIDItMmg0YzEgMCAyIDEgMiAydjIiLz48bGluZSB4MT0iMTAiIHgyPSIxMCIgeTE9IjExIiB5Mj0iMTciLz48bGluZSB4MT0iMTQiIHgyPSIxNCIgeTE9IjExIiB5Mj0iMTciLz48L3N2Zz4=" alt=""></button>
        
      </div>
    `
  })
}

async function addEncarregado() {
  const nome = document.querySelector('#encarregado-nome').value

  const response = await axios.post(
    'http://localhost:8080/encarregado/adicionar',
    {
      nome: nome,
    }
  )

  alert('Encarregado adicionado!')

  openEncarregadoModal()
}

async function deletarOcorrencia(id) {
  const confirmar = confirm(
    'Tem certeza de que deseja deletar esta ocorrência?'
  )
  if (confirmar) {
    const resposta = await axios.delete(
      `http://localhost:8080/ocorrencia/delete/${id}`
    )
    console.log(resposta)
    if (resposta.status === 200) {
      const ocorrenciaDiv = document.querySelector(
        `.ocorrencia[data-id="${id}"]`
      )
      ocorrenciaDiv.remove()
      alert('Ocorrência deletada com sucesso!')
    } else {
      alert('Erro ao deletar a ocorrência. Tente novamente.')
    }
  }
}

async function alterarStatusOcorrencia(select) {
  const statusOcorrencia = select.value
  const idOcorrencia =
    select.parentElement.parentElement.getAttribute('data-id')

  await axios.put(`http://localhost:8080/ocorrencia/updateStatus`, {
    id: idOcorrencia,
    statusOcorrencia: statusOcorrencia,
  })

  alert(
    `Status da ocorrência ${idOcorrencia} alterado para: ${statusOcorrencia}`
  )

  const cardOcorrencia = select.closest('.ocorrencia')
  const bolinhaStatus = cardOcorrencia.querySelector('.bolinha-status')

  bolinhaStatus.classList.remove(
    'background-orange-indicator',
    'background-green-indicator',
    'background-yellow-indicator'
  )

  bolinhaStatus.classList.add(selectColorStatusOcorrencia(statusOcorrencia))
}

document
  .getElementById('form-ocorrencia')
  .addEventListener('submit', async function (event) {
    event.preventDefault() // Evita o recarregamento da página

    const descricao = document.querySelector('#descricao').value
    const statusOcorrencia = document.querySelector('#statusOcorrencia').value
    const agenteId = document
      .querySelector('.btn-agent-Ocorrencia')
      .getAttribute('data-id')

    if (!agenteId) {
      alert('Por favor, selecione um agente.')
      return
    }

    await axios.post('http://localhost:8080/ocorrencia/adicionar', {
      observacoes: descricao,
      statusOcorrencia: statusOcorrencia,
      agente: { id: agenteId },
    })

    alert('Ocorrência adicionada com sucesso!')
    getAllOcorrencias() // Atualiza a lista de ocorrências
    openOcorrenciaModal() // Fecha o modal de ocorrências
  })

function selectColorStatusOcorrencia(statusOcorrencia) {
  if (statusOcorrencia == 'Pendente') {
    return 'background-orange-indicator'
  } else if (statusOcorrencia == 'Finalizado') {
    return 'background-green-indicator'
  } else if (statusOcorrencia == 'Em Andamento') {
    return 'background-yellow-indicator'
  }
}

function inputAgente() {
  const nomeAgente = document.querySelector('#nomeAgente').value
  const cpfAgente = document.querySelector('#cpfAgente').value
  const rgAgente = document.querySelector('#rgAgente').value
  const departamentoAgente = document.querySelector('#DepartamentoAgente').value
  const idEncarregado = document
    .querySelector('#btn-add-encarregado-agente')
    .getAttribute('data-id')

  adicionarAgente(
    nomeAgente,
    cpfAgente,
    rgAgente,
    departamentoAgente,
    idEncarregado
  )
}
async function adicionarAgente(
  nomeAgente,
  cpfAgente,
  rgAgente,
  departamentoAgente,
  idEncarregado
) {
  const resposta = await axios.post('http://localhost:8080/pessoa/adicionar', {
    nome: nomeAgente,
    cpf: cpfAgente,
    rg: rgAgente,
  })

  let idPessoa = resposta.data.id

  const resposta1 = await axios.post('http://localhost:8080/agente/adicionar', {
    pessoa: {
      id: idPessoa,
    },
    departamento: departamentoAgente,
  })

  const resposta2 = await axios.put(
    `http://localhost:8080/encarregado/addAgenteEncarregado/${idEncarregado}`,
    {
      id: resposta1.data.id,
    }
  )
  alert('Agente adicionada com sucesso!') // Atualiza a lista de ocorrências
  openAgenteModal()
}

function openEncarregadoModal() {
  let encarregadoMod = document.querySelector('.contain-form-modal-encarregado')
  let backGroudModal = document.querySelector(
    '.background-open-modalEncarregado'
  )

  if (
    encarregadoMod.style.display == 'none' ||
    encarregadoMod.style.display == ''
  ) {
    encarregadoMod.style.display = 'flex'
    backGroudModal.style.display = 'block'
    document.body.style.overflowY = 'hidden'
  } else {
    backGroudModal.style.display = 'none'
    encarregadoMod.style.display = 'none'
    document.body.style.overflowY = 'scroll'
  }
}

function openAgenteModal() {
  let agenteMod = document.querySelector('.contain-form-modal')
  let backGroudModal = document.querySelector('.background-open-modalAgente')

  if (agenteMod.style.display == 'none' || agenteMod.style.display == '') {
    agenteMod.style.display = 'flex'
    backGroudModal.style.display = 'block'
    document.body.style.overflowY = 'hidden'
  } else {
    backGroudModal.style.display = 'none'
    agenteMod.style.display = 'none'
    document.body.style.overflowY = 'scroll'
  }
}

function openOcorrenciaModal() {
  let ocorrenciaMod = document.querySelector('.contain-form-modal-ocorrencia')
  let backGroudModal = document.querySelector(
    '.background-open-modalOcorrencia'
  )

  if (
    ocorrenciaMod.style.display == 'none' ||
    ocorrenciaMod.style.display == ''
  ) {
    ocorrenciaMod.style.display = 'flex'
    backGroudModal.style.display = 'block'
    document.body.style.overflowY = 'hidden'
  } else {
    backGroudModal.style.display = 'none'
    ocorrenciaMod.style.display = 'none'
    document.body.style.overflowY = 'scroll'
  }
}

function openListAgenteEmOcorrencia() {
  const selectAgenteMod = document.querySelector(
    '.contain-form-modal-lista-select'
  )
  const backGroudModal = document.querySelector(
    '.background-open-modalListaAgenteSelect'
  )
  const selectAgente = document.getElementById('modalAgente')

  selectAgente.style.display = 'none' // Fecha o modal de agentes se estiver aberto
  selectAgenteMod.style.display = 'none' // Fecha qualquer outra lista
  backGroudModal.style.display = 'block' // Fecha o fundo escuro

  selectAgenteMod.style.display = 'block'
  backGroudModal.style.display = 'none'

  listAgenteEmOcorrencia()
}

async function listAgenteEmOcorrencia() {
  const modal = document.getElementById('modalAgente')
  let tbody = document.querySelector('#tabelaAgentes tbody')

  tbody.innerHTML = ''

  const response = await axios.get('http://localhost:8080/agente/listar')
  const agentes = response.data

  agentes.forEach((agente) => {
    tbody.innerHTML += `
      <tr onClick="selecionarAgente(this)" >
        <td>${agente.id}</td>
        <td>${agente.pessoa.nome}</td>
        <td>${agente.departamento}</td>
        <td><button>Selecionar</button></td>
      </tr>
    `
  })

  modal.style.display = 'flex'
}

function selecionarAgente(tr) {
  const buttonAddAgente = document.querySelector('.btn-agent-Ocorrencia')
  buttonAddAgente.setAttribute(
    'data-id',
    tr.querySelectorAll('td')[0].innerHTML
  )

  buttonAddAgente.innerText = `Agente Selecionado: ${
    tr.querySelectorAll('td')[1].innerText
  }`

  fecharModalAgente()
}

function selecionarEncarregados(tr) {
  const buttonAddAgenteEncarregados = document.querySelector(
    '.btn-encarregado-Agente'
  )
  buttonAddAgenteEncarregados.setAttribute(
    'data-id',
    tr.querySelectorAll('td')[0].innerHTML
  )

  buttonAddAgenteEncarregados.innerText = `Encarregado Selecionado: ${
    tr.querySelectorAll('td')[1].innerText
  }`

  fecharModalEncarregado()
}

function fecharModalAgente() {
  const modal = document.getElementById('modalAgente')
  modal.style.display = 'none'
  const listaAgenteMod = document.querySelector(
    '.contain-form-modal-lista-select'
  )
  listaAgenteMod.style.display = 'none'
  const backGroudModal = document.querySelector(
    '.background-open-modalListaAgente'
  )
  backGroudModal.style.display = 'none'
}

function fecharModalEncarregado() {
  const modal = document.querySelector('.contain-form-modal-lista-encarregado')
  modal.style.display = 'none'
  const listaEncarregadosMod = document.querySelector(
    '.contain-form-modal-lista-encarregado'
  )
  listaEncarregadosMod.style.display = 'none'
  const backGroudModal = document.querySelector(
    '.background-open-modalListaEncarregado'
  )
  backGroudModal.style.display = 'none'
}

function openListaAgenteModal() {
  const listaAgenteMod = document.querySelector('.contain-form-modal-lista')
  const backGroudModal = document.querySelector(
    '.background-open-modalListaAgente'
  )

  if (
    listaAgenteMod.style.display === 'none' ||
    listaAgenteMod.style.display === ''
  ) {
    listaAgenteMod.style.display = 'block' // Mostra o modal
    backGroudModal.style.display = 'block' // Ativa o fundo escuro
    document.body.style.overflowY = 'hidden'
    listarAgentes() // chama a função para listar os agentes
  } else {
    listaAgenteMod.style.display = 'none' // Esconde o modal
    backGroudModal.style.display = 'none' // Esconde o fundo escuro
    document.body.style.overflowY = 'scroll'
  }
}

function openListaEncarregado() {
  const listaEncarregadosMod = document.querySelector(
    '.contain-form-modal-lista-encarregado'
  )
  const backGroudModal = document.querySelector(
    '.background-open-modalListaEncarregado'
  )

  if (
    listaEncarregadosMod.style.display === 'none' ||
    listaEncarregadosMod.style.display === ''
  ) {
    listaEncarregadosMod.style.display = 'block' // Mostra o modal
    backGroudModal.style.display = 'block' // Ativa o fundo escuro
    document.body.style.overflowY = 'hidden'
    listarEncarregados() // chama a função para listar os agentes
  } else {
    listaEncarregadosMod.style.display = 'none' // Esconde o modal
    backGroudModal.style.display = 'none' // Esconde o fundo escuro
    document.body.style.overflowY = 'scroll'
  }
}

async function listarEncarregados() {
  const response = await axios.get('http://localhost:8080/encarregado/listar')
  const encarregados = response.data

  const tabelaCorpo = document.querySelector('#tabela-add-encarregado tbody')
  tabelaCorpo.innerHTML = ''

  encarregados.forEach((encarregado) => {
    const { id, nome } = encarregado

    tabelaCorpo.innerHTML += `
      <tr onclick="selecionarEncarregados(this)"=>
        <td>${id}</td> 
        <td>${nome}</td>
        <td><button style="float: left">Selecionar</button></td>
      </tr>
    `
  })
}

async function listarAgentes() {
  const response = await axios.get('http://localhost:8080/agente/listar')
  const agentes = response.data

  const tabelaCorpo = document.querySelector('#tabela-corpo')
  tabelaCorpo.innerHTML = ''

  agentes.forEach((agente) => {
    const { id, pessoa, departamento } = agente

    const linhaHTML = `
      <tr>
        <td>${pessoa.nome}</td>
        <td>${pessoa.cpf}</td>
        <td>${departamento}</td>
        <td>
          <div class="div-delete">
            <button onclick="deletarAgente(${id})" class="btn-deletar">
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXRyYXNoLTIiPjxwYXRoIGQ9Ik0zIDZoMTgiLz48cGF0aCBkPSJNMTkgNnYxNGMwIDEtMSAyLTIgMkg3Yy0xIDAtMi0xLTItMlY2Ii8+PHBhdGggZD0iTTggNlY0YzAtMSAxLTIgMi0yaDRjMSAwIDIgMSAyIDJ2MiIvPjxsaW5lIHgxPSIxMCIgeDI9IjEwIiB5MT0iMTEiIHkyPSIxNyIvPjxsaW5lIHgxPSIxNCIgeDI9IjE0IiB5MT0iMTEiIHkyPSIxNyIvPjwvc3ZnPg==" 
              alt="Deletar" class="icon-delete"/>
            </button>
          </div>
        </td>
      </tr>
    `
    tabelaCorpo.innerHTML += linhaHTML
  })
}

async function deletarAgente(id) {
  const confirmar = confirm('Tem certeza de que deseja deletar este agente?')
  if (confirmar) {
    const response = await axios.delete(
      `http://localhost:8080/agente/delete/${id}`
    )
    if (response.status === 200) {
      alert('Agente deletado com sucesso!')
      listarAgentes() // Atualiza a lista após a exclusão
    } else {
      alert('Erro ao deletar o agente. Tente novamente.')
    }
  }
}

//async function deletarEncarregado(id) {
//const confirmar = confirm('Tem certeza de que deseja deletar este encarregado?')
//if (confirmar) {
// const response = await axios.delete(`http://localhost:8080/encarregado/delete/${id}`)
//if (response.status === 200) {
// alert('Encarregado deletado com sucesso!')
//listarEncarregados() // Atualiza a lista após a exclusão
//} else {
// alert('Erro ao deletar o Encarregado. Tente novamente.')
//}
//}
//}

//delete

const cpfInput = document.querySelector('#cpfAgente')
const rgInput = document.querySelector('#rgAgente')

cpfInput.addEventListener('input', () => {
  let value = cpfInput.value.replace(/\D/g, '')

  if (value.length > 3 && value.length <= 6) {
    value = value.replace(/^(\d{3})(\d+)/, '$1.$2')
  } else if (value.length > 6 && value.length <= 9) {
    value = value.replace(/^(\d{3})(\d{3})(\d+)/, '$1.$2.$3')
  } else if (value.length > 9) {
    value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4')
  }

  cpfInput.value = value.slice(0, 14)
})

rgInput.addEventListener('input', () => {
  let value = rgInput.value.replace(/\D/g, '')

  if (value.length > 2 && value.length <= 5) {
    value = value.replace(/^(\d{2})(\d+)/, '$1.$2')
  } else if (value.length > 5 && value.length <= 8) {
    value = value.replace(/^(\d{2})(\d{3})(\d+)/, '$1.$2.$3')
  } else if (value.length > 8) {
    value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4')
  }

  rgInput.value = value.slice(0, 12)
})
