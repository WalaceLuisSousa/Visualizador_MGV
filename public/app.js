//==================================================
// ELEMENTOS
//==================================================

const grid = document.getElementById("produtos");

const textoOferta =
    document.getElementById("textoOferta");

const totalProdutos =
    document.getElementById("totalProdutos");

const paginaAtual =
    document.getElementById("paginaAtual");

const ultimaAtualizacao =
    document.getElementById("ultimaAtualizacao");

//==================================================
// VARIÁVEIS
//==================================================

let produtos = [];

let produtosFiltrados = [];

let pagina = 0;

const produtosPorPagina = 10;

let timerOferta = null;

let timerPagina = null;

//==================================================
// RELÓGIO
//==================================================

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


//==================================================
// BUSCA PRODUTOS DA API
//==================================================

async function carregarProdutos(){

    try{

        const resposta =
            await fetch("/api/produtos");

        if(!resposta.ok){

            throw new Error("Erro ao carregar produtos");

        }

        const dados =
            await resposta.json();

        produtos = dados;

        produtos.sort((a,b)=>

            a.descricao.localeCompare(b.descricao)

        );

        produtosFiltrados = [...produtos];

        totalProdutos.innerHTML =
            produtos.length;

        pagina = 0;

        mostrarPagina();

        iniciarOfertas();

        atualizarRodape();

    }

    catch(erro){

        console.error(erro);

    }

}


//==================================================
// RODAPÉ
//==================================================

function atualizarRodape(){

    const agora = new Date();

    ultimaAtualizacao.innerHTML =

        "Atualizado às "

        +

        agora.toLocaleTimeString("pt-BR");

}

//==================================================
// CRIAR LINHA
//==================================================

function criarLinha(prod){

    const ehOferta = prod.precoClube > 0;

    return `

    <div class="linhaProduto ${ehOferta ? "oferta" : ""}">

        <div>

            <div class="nomeProduto">

                ${prod.descricao}

            </div>

            ${
                ehOferta
                ?

                `<div class="ofertaTexto">

                    🔥 PREÇO CLUBE

                </div>`

                :

                ""

            }

        </div>

        <div class="tipoProduto">

            ${prod.tipoVenda=="0" ? "KG" : "UN"}

        </div>

        <div class="precoProduto">

            <span class="rs">

                R$

            </span>

            <span class="valor">

                ${prod.preco.toFixed(2).replace(".",",")}

            </span>

        </div>

    </div>

    `;

}

//==================================================
// MOSTRAR PÁGINA
//==================================================

function mostrarPagina(){

    const inicio = pagina * produtosPorPagina;

    const fim = inicio + produtosPorPagina;

    const lista = produtosFiltrados.slice(inicio,fim);

    grid.style.opacity = 0;

    setTimeout(()=>{

        grid.innerHTML = "";

        lista.forEach(prod=>{

            grid.innerHTML += criarLinha(prod);

        });

        grid.style.opacity = 1;

        atualizarPagina();

    },200);

}

//==================================================
// INFORMAÇÃO DA PÁGINA
//==================================================

function atualizarPagina(){

    const totalPaginas = Math.ceil(

        produtosFiltrados.length /

        produtosPorPagina

    );

    paginaAtual.innerHTML =

        `Página ${pagina+1} de ${totalPaginas}`;

}

//==================================================
// BOTÕES
//==================================================

document
.getElementById("proximo")
.addEventListener("click",()=>{

    const totalPaginas = Math.ceil(

        produtosFiltrados.length /

        produtosPorPagina

    );

    if(pagina < totalPaginas-1){

        pagina++;

    }

    else{

        pagina = 0;

    }

    mostrarPagina();

});

document
.getElementById("anterior")
.addEventListener("click",()=>{

    const totalPaginas = Math.ceil(

        produtosFiltrados.length /

        produtosPorPagina

    );

    if(pagina>0){

        pagina--;

    }

    else{

        pagina = totalPaginas-1;

    }

    mostrarPagina();

});

//==================================================
// PESQUISA
//==================================================

function pesquisar(texto){

    texto = texto.toUpperCase().trim();

    if(texto===""){

        produtosFiltrados=[...produtos];

    }

    else{

        produtosFiltrados = produtos.filter(prod=>

            prod.descricao.toUpperCase().includes(texto)

            ||

            prod.ean.includes(texto)

        );

    }

    pagina=0;

    mostrarPagina();

}


//==================================================
// OFERTAS
//==================================================

function iniciarOfertas(){

    if(timerOferta){

        clearInterval(timerOferta);

    }

    const ofertas = produtos.filter(p=>p.precoClube>0);

    let lista = ofertas.length>0 ? ofertas : produtos;

    let indice = 0;

    trocarOferta();

    timerOferta = setInterval(trocarOferta,5000);

    function trocarOferta(){

        if(lista.length===0)
            return;

        if(indice>=lista.length)
            indice=0;

        const p = lista[indice];

        if(p.precoClube>0){

            textoOferta.innerHTML =

                `🔥 OFERTA • ${p.descricao} • Clube R$ ${p.precoClube.toFixed(2).replace(".",",")}`;

        }

        else{

            textoOferta.innerHTML =

                `${p.descricao} • R$ ${p.preco.toFixed(2).replace(".",",")}`;

        }

        indice++;

    }

}


//==================================================
// PAGINAÇÃO AUTOMÁTICA
//==================================================

function iniciarPaginacaoAutomatica(){

    if(timerPagina){

        clearInterval(timerPagina);

    }

    timerPagina = setInterval(()=>{

        const totalPaginas = Math.ceil(

            produtosFiltrados.length /

            produtosPorPagina

        );

        pagina++;

        if(pagina>=totalPaginas){

            pagina=0;

        }

        mostrarPagina();

    },10000);

}


//==================================================
// REINICIAR TUDO
//==================================================

function reiniciarSistema(){

    iniciarOfertas();

    iniciarPaginacaoAutomatica();

}


//==================================================
// ORDENAÇÃO
//==================================================

function ordenarProdutos(){

    produtos.sort((a,b)=>{

        return a.descricao.localeCompare(

            b.descricao,

            "pt-BR"

        );

    });

    produtosFiltrados=[...produtos];

}

//==================================================
// COMPARAÇÃO DE PREÇOS
//==================================================

let cacheProdutos = {};

function compararProdutos(novosProdutos){

    novosProdutos.forEach(prod=>{

        const antigo = cacheProdutos[prod.ean];

        if(!antigo){

            cacheProdutos[prod.ean] = {

                preco: prod.preco

            };

            return;

        }

        if(antigo.preco != prod.preco){

            console.log(

                "Preço alterado:",

                prod.descricao,

                antigo.preco,

                "->",

                prod.preco

            );

            antigo.preco = prod.preco;

        }

    });

}

//==================================================
// ATUALIZAÇÃO AUTOMÁTICA
//==================================================

async function atualizarProdutos(){

    try{

        const resposta = await fetch(

            "/api/produtos?ts=" + Date.now()

        );

        if(!resposta.ok){

            return;

        }

        const dados = await resposta.json();

        compararProdutos(dados);

        produtos = dados;

        ordenarProdutos();

        mostrarPagina();

        iniciarOfertas();

        atualizarRodape();

    }

    catch(e){

        console.error(e);

    }

}

//==================================================
// AUTO REFRESH
//==================================================

setInterval(()=>{

    atualizarProdutos();

},60000);


//==================================================
// INICIALIZAÇÃO
//==================================================

window.addEventListener("load",async()=>{

    await carregarProdutos();

    iniciarPaginacaoAutomatica();

});


//==================================================
// VISIBILIDADE DA ABA
//==================================================

document.addEventListener(

    "visibilitychange",

    ()=>{

        if(document.hidden){

            return;

        }

        atualizarProdutos();

    }

);


//==================================================
// TECLADO
//==================================================

document.addEventListener("keydown",(e)=>{

    if(e.key==="ArrowRight"){

        document

            .getElementById("proximo")

            .click();

    }

    if(e.key==="ArrowLeft"){

        document

            .getElementById("anterior")

            .click();

    }

});


//==================================================
// DEBUG
//==================================================

console.log(

    "Visualizador MGV iniciado."

);