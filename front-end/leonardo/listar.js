

//Aqui irei utilizar um método GET junto com a ferramenta Axios para listar os agentes que já estão inseridos no banco


async function listar () {// dentro de () passaria um PARAMETRO
    const resultadoLista = await axios.get(
        'http://localhost:8080/pji-ocorrencia/listar'
    )
    console.log(resultadoLista);

    const ocorrencias = resultadoLista.data;

    const ocorrenciasDiv = document.querySelector('.ocorrencias-div');

    
}



const url = ''; //aqui tenho que inserir a url do sistema 

        const data = {
            //no caso aqui eu iria utilizar se eu quiser enviar um dado
        }

        const fazerRequisicao = async () => {
            // try{
            //     const response = await axios.post(url, data);//aqui eu uso para ver  a resposta do servidor e ver se foi feito corretamente
            //     console.log('e pra funcionar',response.data);
            // }catch (error) {
            //     console.log('nao funciou ',error);
            // }
        };
        fazerRequisicao; //aqui eu chamo da mesma forma que se faz no react 