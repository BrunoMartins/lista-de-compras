let listaDeItens = [];
let itemAEditar;

const form = document.getElementById("form-itens");
const itensInput = document.getElementById("receber-item");
const ulItens = document.getElementById("lista-de-itens");
const ulItensComprados = document.getElementById("itens-comprados");
const listaRecuperada = localStorage.getItem('listaDeItens');

function atualizaLocalStorage() {
    localStorage.setItem('listaDeItens', JSON.stringify(listaDeItens))
}

if(listaRecuperada) {//caso tenha algum dado salvo na localstorage vai dar true
    listaDeItens = JSON.parse(listaRecuperada)
    mostrarItem();
}else {
    listaDeItens = []
}

form.addEventListener("submit", function (evento){
    evento.preventDefault();
    salvarItem();
    mostrarItem();
    itensInput.focus();
})

function salvarItem(){
    const comprasItem = itensInput.value;
    const checarDuplicado = listaDeItens.some((elemento) => elemento.valor.toUpperCase() === comprasItem.toUpperCase())//semelhante ao método inclues, porém utilizado em objetos

    if (checarDuplicado) {
        alert("Item já existe.")
    } else {
        listaDeItens.push({// Alimentando a lista com os objetos
        valor: comprasItem,
        check: false,//Utilizado para manipular o Doom ao ser clicado
        })
    }
    itensInput.value = "";
}

function mostrarItem(){
    ulItens.innerHTML="";
    ulItensComprados.innerHTML="";
    listaDeItens.forEach((elemento,index) =>{
        if(elemento.check){//caso o checkbox esteja true
            ulItensComprados.innerHTML+= `
            <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
            <div>
                <input type="checkbox" checked class="is-clickable" />  
                <span class="itens-comprados is-size-5">${elemento.valor}</span>
            </div>
            <div>
                <i class="fa-solid fa-trash is-clickable deletar"></i>
            </div>
        </li>
        `;
        }else{
        
        ulItens.innerHTML += `
            <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
            <div>
                <input type="checkbox" class="is-clickable" />
                <input type="text" class="is-size-5" value="${elemento.valor}" ${index !== Number(itemAEditar) ? 'disabled' : ''}></input>
            </div>
            <div>
            ${ index === Number(itemAEditar) ? '<button onclick="salvarEdicao()"><i class="fa-regular fa-floppy-disk is-clickable"></i></button>' :
             '<i class="fa-regular is-clickable fa-pen-to-square editar"></i>'}
                <i class="fa-solid fa-trash is-clickable deletar"></i>
            </div>
        </li>
        `;
     }
     const itemEditado = document.querySelector(`[data-value="${itemAEditar}"] input[type="text"]`);

     if (itemEditado) {//caso tenha clicado para editar
        itemEditado.removeAttribute('disabled');
        itemEditado.focus();
        itemEditado.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                salvarEdicao();
            }
        })
     
    }
    atualizaLocalStorage();
})

    const inputsCheck = document.querySelectorAll('input[type ="checkbox"]');

    inputsCheck.forEach((input) =>{
        input.addEventListener("click", (evento) =>{
            const valorDoElemento = (evento.target.parentElement.parentElement.getAttribute("data-value"));//Utilizando o parentElement até chegar no elemento pai (li) e pegando o atributo do data-value que possui o index de cada item
            listaDeItens[valorDoElemento].check = evento.target.checked//Acesando o objeto clicado e alterando seu check para true caso o checkbox for selecionado
            mostrarItem();//chamando a função para poder utilizar a verificação do true do checkbox

        })

    })
    const deletarObjetos = document.querySelectorAll(".deletar")

    deletarObjetos.forEach((evento) => {
        evento.addEventListener("click", (evento) => {
            valorDoElemento = evento.target.parentElement.parentElement.getAttribute("data-value")
            listaDeItens.splice(valorDoElemento,1)
            mostrarItem()
        })
    })

    const editarItens = document.querySelectorAll(".editar");

    editarItens.forEach((evento) => {
        evento.addEventListener("click", (evento) => {
            itemAEditar = evento.target.parentElement.parentElement.getAttribute("data-value");
            mostrarItem();
        })
    })


}

function salvarEdicao(){
    const itemEditado = document.querySelector(`[data-value="${itemAEditar}"] input[type="text"]`);//selecionando o input que foi clicado
    listaDeItens[itemAEditar].valor = itemEditado.value;//atualiza o objeto
    itemAEditar = -1 //para não guardar o indice do item já editado
    itemEditado.setAttribute('disabled', true);
    mostrarItem();
}