const grid = document.getElementById("produtos");
const pesquisa = document.getElementById("pesquisa");
const totalProdutos = document.getElementById("totalProdutos");
const textoOferta = document.getElementById("textoOferta");

let produtos = [];
let produtosFiltrados = [];

let pagina = 0;
const produtosPorPagina = 12;

let timerOferta = null;
let ultimoJSON = "";

//=====================================
// RELÓGIO
//=====================================

function atualizarRelogio(){

    const agora = new Date();

    document.getElementById("hora").innerHTML =
        agora.toLocaleTimeString("pt-BR");

    document.getElementById("data").innerHTML =
        agora.toLocaleDateString("pt-BR",{

            weekday:"long",
            day:"2-digit",
            month:"2-digit",
            year:"numeric"

        });

}

setInterval(atualizarRelogio,1000);

atualizarRelogio();


//=====================================
// CARREGA PRODUTOS DA API
//=====================================

async function carregarProdutos(){

    try{

        const resposta = await fetch("/api/produtos?t=" + Date.now());

        if(!resposta.ok){

            throw new Error("Erro ao carregar produtos.");

        }

        const dados = await resposta.json();

        const json = JSON.stringify(dados);

        if(json === ultimoJSON){

            return;

        }

        ultimoJSON = json;

        produtos = dados;

        produtosFiltrados = [...produtos];

        totalProdutos.innerHTML = produtos.length;

        pagina = 0;

        mostrarPagina();

        iniciarOferta();

        console.log("Produtos atualizados.");

    }

    catch(erro){

        console.error(erro);

    }

}


//=====================================
// CRIA CARD
//=====================================

function criarCard(prod){

    const ehOferta = Number(prod.precoClube) > 0;

    return `

        <div class="card ${ehOferta ? "oferta" : ""}">

            ${ehOferta ?

            `<div class="seloOferta">

                🔥 OFERTA

            </div>`

            : ""}

            <div class="descricao">

                ${prod.descricao}

            </div>

            <div class="preco">

                R$ ${Number(prod.preco).toFixed(2).replace(".",",")}

            </div>

            <div class="unidade">

                ${prod.tipoVenda === "0" ? "POR KG" : "POR UN"}

            </div>

            ${ehOferta ?

            `<div class="precoClube">

                Clube R$ ${Number(prod.precoClube).toFixed(2).replace(".",",")}

            </div>`

            : ""}

        </div>

    `;

}

//=====================================
// PAGINAÇÃO
//=====================================

function mostrarPagina(){

    const inicio = pagina * produtosPorPagina;

    const fim = inicio + produtosPorPagina;

    const lista = produtosFiltrados.slice(inicio, fim);

    grid.innerHTML = "";

    lista.forEach(prod => {

        grid.innerHTML += criarCard(prod);

    });

}


//=====================================
// BOTÃO PRÓXIMO
//=====================================

document
.getElementById("proximo")
.addEventListener("click",()=>{

    if((pagina + 1) * produtosPorPagina < produtosFiltrados.length){

        pagina++;

        mostrarPagina();

    }

});


//=====================================
// BOTÃO ANTERIOR
//=====================================

document
.getElementById("anterior")
.addEventListener("click",()=>{

    if(pagina > 0){

        pagina--;

        mostrarPagina();

    }

});

//=====================================
// OFERTA
//=====================================

function iniciarOferta(){

    if(produtos.length === 0)
        return;

    if(timerOferta){

        clearInterval(timerOferta);

    }

    let indice = 0;

    trocarOferta();

    timerOferta = setInterval(trocarOferta,5000);

    function trocarOferta(){

        if(indice >= produtos.length){

            indice = 0;

        }

        const p = produtos[indice];

        const preco = Number(p.preco)
            .toFixed(2)
            .replace(".",",");

        textoOferta.innerHTML =

            `🔥 OFERTA • ${p.descricao} • R$ ${preco}`;

        indice++;

    }

}


//=====================================
// ATUALIZAÇÃO AUTOMÁTICA
//=====================================

// Carrega ao abrir
carregarProdutos();

// Atualiza a cada minuto
setInterval(carregarProdutos,60000);