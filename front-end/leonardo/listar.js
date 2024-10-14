async function listar() {
    try {
        const resultadoLista = await axios.get('http://localhost:8080/ocorrencias/listar');
        console.log(resultadoLista);

        const ocorrencias = resultadoLista.data;
        const ocorrenciasDiv = document.querySelector('.ocorrencias-div');

        // Limpa a div antes de adicionar novas ocorrências
        ocorrenciasDiv.innerHTML = '';

        // Itera sobre as ocorrências e cria os elementos
        ocorrencias.forEach(ocorrencia => {
            const ocorrenciaDiv = document.createElement('div');
            ocorrenciaDiv.classList.add('ocorrencia');

            // Cria os elementos para cada ocorrência
            const titulo = document.createElement('h3');
            titulo.textContent = `Ocorrência #${ocorrencia.id}`; // Supondo que exista um campo `id`

            const descricao = document.createElement('p');
            descricao.textContent = `Descrição: ${ocorrencia.observacoes}`; // Supondo que exista um campo `descricao`

            const agente = document.createElement('p');
            agente.textContent = `Agente: ${ocorrencia.agente.nome}`; // Supondo que exista um campo `agente`

            // Adiciona os elementos à div da ocorrência
            ocorrenciaDiv.appendChild(titulo);
            ocorrenciaDiv.appendChild(descricao);
            ocorrenciaDiv.appendChild(agente);

            // Adiciona a ocorrência à div principal
            ocorrenciasDiv.appendChild(ocorrenciaDiv);
        });
    } catch (error) {
        console.error('Erro ao buscar ocorrências:', error);
    }
}
async function enviarDados(dados) {
    try {
        const resposta = await fetch('http://localhost:8080/agentes/nao lembro onde ta ', { 
            method: 'POST',  // post server para adicionar os dados se quiser editar dados existentes ja eu adiciono o put 
            headers: { //objeto utilizado para definir cabeçalho 
                'Content-Type': 'application/json'  //informar ao servidor que esta em formato json
            },
            body: JSON.stringify(dados) //enviando os dados que Desejamos e convertendo ele para json
        });

        // Verifica se a resposta foi bem-sucedida
        if (resposta.ok) {
            const resultado = await resposta.json(); // Converte a resposta para JSON
            console.log('Dados enviados com sucesso:', resultado);
        } else {
            console.error('Erro ao enviar dados:', resposta.status, resposta.statusText);
        }
    } catch (erro) {
        console.error('Erro na requisição:', erro);
    }
}

const dadosParaEnviar = {
    agente: {nome: "Nome do Agente" } // enviar o nome do agente pro banco
};
// Chama a função para enviar os dados
enviarDados(dadosParaEnviar);
// Chama o método listar ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    listar();
});
