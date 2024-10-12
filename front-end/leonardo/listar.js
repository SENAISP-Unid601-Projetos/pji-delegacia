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

// Chama o método listar ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    listar();
});
