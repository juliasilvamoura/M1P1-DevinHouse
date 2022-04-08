/* Pegando elementos com DOM*/

// Botões
const btnLimparChecklist = document.getElementById('clear-check')
const btnLimparList = document.getElementById('clearList')
const bntAdd = document.getElementById('add-item')

// Inputs
const produto = document.getElementById('produto')

// Outputs
let listaProduto = document.getElementById('listaProduto')
let gasto = document.querySelector('.secaoImpressaoResultados_valor p')

// Evento de click nos Botões
bntAdd.addEventListener('click', addItem);
btnLimparChecklist.addEventListener('click', removerItemComprado);
btnLimparList.addEventListener('click', limparLista);

// Criando a Lista de objetos
let lista = [];
// Buscar lista no localStorange
const listaJSON = localStorage.getItem('lista');
// Verifica se tem algo no storange
if (listaJSON) {
    // função que transforma o Json em lista de obj
    retornarStorage();
}

// Add Item na lista
function addItem() {
    // se o input não estiver vazio
    if (produto.value) {
        // add na lista de obj
        lista.push({
            id: Date.now(),
            name: produto.value,
            status: false,
            valor: 0
        });
        // apaga o que estava escrito no input
        produto.value = '';

        //chamar a função atualizarInterface 
        atualizarInterface();

        //chamar a função saveStorage
        saveStorage();

        // senão retorna um alert
    } else {
        alert('Insira um produto!');
    }
}

// Atualizar Interface
function atualizarInterface() {
    // Inicializa a lista
    listaProduto.innerHTML = '';
    // percorre a lista
    lista.forEach(function (item) {
        // criar lista passando o id
        const li = document.createElement('li');
        li.id = `${item.id}`;

        // criar checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        // se o item está com status true ele deixa o checkbox flagado
        if(item.status){
            // SS do checkbox
            li.style.textDecoration = 'line-through';
            li.style.textDecorationThickness = '2px';
            li.style.textDecorationColor = '#96007C';
            checkbox.checked = true;
        }
        // criar img/botão excluir item
        const excluir = document.createElement('img');
        excluir.src = './img/botao-x.png'
        excluir.alt = 'Excluir Item'

        // cria a img/botão para editar
        const editar = document.createElement('img');
        editar.src = './img/editar.png'
        editar.alt = 'Editar Item'
        

        // Add evento click
        excluir.onclick = function () {
            // chama removerItem
            removerItem(item.id)
        }

        // Add evento click no checkbox
        checkbox.onclick = event => {
            // pega o evento se está checked ou não
            if (event.target.checked){ 
                // status recebe true
                item.status = true; 
                // CSS do checkbox
                li.style.textDecoration = 'line-through';
                li.style.textDecorationThickness = '2px';
                li.style.textDecorationColor = '#96007C';
                // recebe o valor do produto
                const valor = prompt("Qual o valor do Produto?")
                item.valor = Number(valor);
            }
            /*Se o produto for desmarcado deve retornar status false e desriscar o poduto
            além de subtrair o valor da soma*/
            else {
                li.style.textDecoration = 'none';
                item.status = false;
                // passa 0 para o valor, assim retira o valor da compra
                item.valor = Number(0);
            }
            // chama calcular o gasto
            calcularGasto();
        }

        // Add evento click na img de editar produto
        editar.onclick = function () {
            // recebe novo nome pelo prompt
            const novoProduto = prompt("Qual o novo Produto?")
            // chama editarItem passando o id e o novo nome
            editarItem(item.id,novoProduto)
            
        }

        
        // Cria a lista na tela - add checkbox, texto, imagem de excluir e editar na li
        li.appendChild(checkbox)
        li.appendChild(document.createTextNode(item.name));
        li.appendChild(excluir)
        li.appendChild(editar)
        // Add checkbox, 
        listaProduto.appendChild(li)
    });
}

// Calcular o valor do gasto dos produtos checked
function calcularGasto() {
    // Reduce para fazer a soma
    let soma = lista.reduce((acumulador, item) => {
        if (item.status == true) {
            return acumulador + item.valor
            // senão tiver os valores retorna zero = acumulador
        } else return acumulador;

    }, 0);

    // escreve na variavel gasto
    gasto.innerHTML = `R$ ${soma}`;
}

// Remover Item
function removerItem(id) {
    // usando filter e seleciona todos os produtos menos o que será excluído
    let result = lista.filter(function (item) {
        return item.id !== id;
    })
    // lista recebe só os produtos que não forão excluídos
    lista = result;

    //chamar a função atualizarInterface
    atualizarInterface();

    //chamar a função saveStorage
    saveStorage();

    // calcular gasto
    calcularGasto();
}

// Editar Item
function editarItem(id,novoProduto){
    // faz um forEach para encontrar na condição do if qual é o id
    lista.forEach(function (item){
        if(item.id == id){
            // o produto recebe um novo nome
            item.name = novoProduto;
        }
    })
    //chamar a função atualizarInterface
    atualizarInterface();

    //chamar a função saveStorage
    saveStorage();
}

// Recomer produto comprado
function removerItemComprado() {
    console.log('quer limpar itens comprados')
    // remover os itens com status true
    // filtra e add apenas os que tem status false (produtos não comprados)
    let result = lista.filter(function (item) {
        return item.status == false;
    })

    // lista recebe produtos não comprados/checked
    lista = result;

    //chamar a função atualizarInterface
    atualizarInterface();

    //chamar a função saveStorage
    saveStorage(); 

    // calcular gasto
    calcularGasto();
}

// Salvar no localStorange
function saveStorage() {

    //Limpar localStorage antes de iniciar 
    localStorage.clear();

    // Converter para JSON
    const listaJSON = JSON.stringify(lista);

    // Salvar no localStorange
    localStorage.setItem('lista', listaJSON);
}

function retornarStorage(){
    // converte para lista
    lista = JSON.parse(listaJSON);

    //chamar a função atualizarInterface
    atualizarInterface();
}

// Limpar lista
function limparLista() {
    // retorna lista vazia
    lista = []; 

    //chamar a função atualizarInterface
    atualizarInterface();

    //chamar a função saveStorage
    saveStorage(); 

    // calcular gasto 
    calcularGasto(); 
}

// adiciona evento de tecla ao digitar no campo
produto.addEventListener('keydown', function (event) {

    // testa se a tecla apertada é Enter
    if (event.key === 'Enter') {

      // se for Enter, executa o addItem
      addItem();
    }
  });