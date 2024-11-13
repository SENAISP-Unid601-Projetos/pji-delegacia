function openAgenteModal() {
  let agenteMod = document.querySelector('.agenteMod')
  let backGroudModal = document.querySelector('.background-open-modalAgente')

  if (agenteMod.style.display == 'none' || agenteMod.style.display == '') {
    agenteMod.style.display = 'block'
    backGroudModal.style.display = 'block'
  } else {
    backGroudModal.style.display = 'none'
    agenteMod.style.display = 'none'
  }
}

function openOcorrenciaMod() {
  let ocorrenciaMod = document.querySelector('.ocorrenciaMod')
  let backGroudMod = document.querySelector('.background-open-mod')

  if (ocorrenciaMod.style.display == 'none' || ocorrenciaMod.style.display == '') {
    ocorrenciaMod.style.display = 'block'
    backGroudMod.style.display = 'block'
  } else {
    backGroudMod.style.display = 'none'
    ocorrenciaMod.style.display = 'none'
  }
}

function listaAgenteModal() {
  let listaMod = document.querySelector('.listaMod')
  let backGroudModalLista = document.querySelector('.background-open-modalLista')

  if (listaMod.style.display == 'none' || listaMod.style.display == '') {
    listaMod.style.display = 'block'
    backGroudModalLista.style.display = 'block'
  } else {
    backGroudModalLista.style.display = 'none'
    listaMod.style.display = 'none'
  }
}

// Função para exibir a lista de agentes
function atualizarLista() {
  const agenteBody = document.getElementById('agenteBody')
  agenteBody.innerHTML = '' // Limpa a tabela

  agentes.forEach((agente, index) => {
    const row = document.createElement('tr')

    // Coluna do nome do agente
    const nomeCell = document.createElement('td')
    nomeCell.textContent = agente
    row.appendChild(nomeCell)

    // Coluna do botão deletar
    const acaoCell = document.createElement('td')
    const deletarBtn = document.createElement('button')
    deletarBtn.textContent = 'Deletar'
    deletarBtn.onclick = () => deletarAgente(index)
    acaoCell.appendChild(deletarBtn)
    row.appendChild(acaoCell)

    agenteBody.appendChild(row)
  })
}

//dadosAgente
document.querySelector('#form-agente').addEventListener('submit', function (event) {
  event.preventDefault()

  const pessoaId = document.querySelector('#pessoaId').value
  const dadosAgente = {
    nome: nome,
    cpf: cpf,
    rg: rg,
    //departamento: departamento
  }

  adicionarAgente(dadosAgente)
})

//Adicão de Agente//remover

adicionarAgente({ nome: 'mikael', cpf: '456', rg: '654' })
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

//adição de Ocorrências
async function adicionarOcorrencia(dadosOcorrencia) {
  const resposta = await axios.post('http://localhost:8080/ocorrencia/adicionar', dadosOcorrencia)
  // if (resposta.status === 200) {
  //   console.log("Ocorrência adicionada com sucesso:", resposta.data);
  //   listar(); // Atualiza a lista de ocorrências após adicionar
  // }
}

async function listar() {
  const resultadoLista = await axios.get('http://localhost:8080/ocorrencia/listar')

  const ocorrencias = resultadoLista.data
  const ocorrenciasDiv = document.querySelector('.ocorrencias-div')
  ocorrenciasDiv.innerHTML = '' // Limpa antes de adicionar

  ocorrencias.forEach((ocorrencia) => {
    //forEach que percorre o Status e muda a cor
    const ocorrenciaDiv = document.createElement('div')
    ocorrenciaDiv.classList.add('ocorrencia')

    // if (ocorrencia.statusOcorrencia === "AguardandoAprovacao") {
    //   ocorrenciaDiv.classList.add("aguardando-aprovacao");
    // } else if (ocorrencia.statusOcorrencia === "Em Andamento") {
    //   ocorrenciaDiv.classList.add("em-andamento");
    // } else if (ocorrencia.statusOcorrencia === "Finalizada") {
    //   ocorrenciaDiv.classList.add("finalizada");
    // }

    const titulo = document.createElement('h3')
    titulo.textContent = `Ocorrência #${ocorrencia.id}`

    const descricao = document.createElement('p')
    descricao.textContent = `Descrição: ${ocorrencia.observacoes}`

    const agente = document.createElement('p')
    agente.textContent = `Agente: ${ocorrencia.agente.nome}`

    ocorrenciaDiv.appendChild(titulo)
    ocorrenciaDiv.appendChild(descricao)
    ocorrenciaDiv.appendChild(agente)

    // Adiciona evento de clique para abrir o modal
    ocorrenciaDiv.addEventListener('click', () => abrirModal(ocorrencia))

    ocorrenciasDiv.appendChild(ocorrenciaDiv)
  })
}

// Função para abrir o modal e preencher os dados
function abrirModal(ocorrencia) {
  const modal = document.getElementById('modalOcorrencia')
  const modalTitulo = document.getElementById('modalTitulo')
  const modalDescricao = document.getElementById('modalDescricao')
  const modalAgente = document.getElementById('modalAgente')

  modalTitulo.textContent = `Ocorrência #${ocorrencia.id}`
  modalDescricao.textContent = `Descrição: ${ocorrencia.observacoes}`
  modalAgente.textContent = `Agente: ${ocorrencia.agente.nome}`

  // Exibe o modal
  modal.style.display = 'block' //Display no css estará NONE para que ele fique invísivel e só abra quando eu mudar aq no js

  // Fecha o modal quando clicar no "X"
  document.querySelector('.close').onclick = function () {
    modal.style.display = 'none'
  }

  // Fecha o modal quando clicar fora da área de conteúdo
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = 'none'
    }
  }
}

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('btn-deletar')) {
    const id = event.target.getAttribute('data-id')
    if (confirm('Tem certeza que deseja deletar esta ocorrência?')) {
      deletarOcorrencia(id)
    }
  }
})

async function deletarOcorrencia(id) {
  try {
    const resposta = await axios.delete(`http://localhost:8080/ocorrencia/deletar/${id}`)
    if (resposta.status === 200) {
      console.log('Ocorrência deletada com sucesso')
      listar() // Atualiza a lista de ocorrências após a exclusão
    }
  } catch (erro) {
    console.error('Erro ao deletar a ocorrência:', erro)
  }
}

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('btn-atualizar-status')) {
    const id = event.target.getAttribute('data-id')
    const novoStatus = 'Resolvido' // Pode capturar o novo status de um campo ou botão
    atualizarStatusOcorrencia(id, novoStatus)
  }
})

async function atualizarStatusOcorrencia(id, novoStatus) {
  try {
    const resposta = await axios.patch(`http://localhost:8080/ocorrencia/atualizarStatus/${id}`, {
      status: novoStatus, // Envia o novo status
    })
    if (resposta.status === 200) {
      console.log('Status atualizado com sucesso:', resposta.data)
      listar() // Atualiza a lista de ocorrências
    }
  } catch (erro) {
    console.error('Erro ao atualizar o status:', erro)
  }
}

document.querySelector('#btnAdicionarAgente').addEventListener('click', function () {
  const nome = document.querySelector('modalagente').value
  const idagente = document.querySelector('idagente').value

  const dadosAgente = {
    nome: nome,
    id: { id: idagente },
  }

  adicionarAgente(dadosAgente)
})

async function deletarAgente(idagente) {
  try {
    const resposta = await fetch(`http://localhost:8080/agente/deletar/${idagente}`, {
      method: 'DELETE',
    })

    if (resposta.ok) {
      console.log('Agente deletado com sucesso')
    } else {
      console.error('Erro ao deletar agente:', resposta.status)
    }
  } catch (erro) {
    console.error('Erro na requisição:', erro)
  }
}

window.onclick = function (event) {
  const modal = document.getElementById('modalAgente')
  if (event.target === modal) {
    modal.style.display = 'none'
  }
}
