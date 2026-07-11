const inputArquivo = document.getElementById("arquivo");
const grid = document.getElementById("produtos");
const pesquisa = document.getElementById("pesquisa");
const totalProdutos = document.getElementById("totalProdutos");
const textoOferta = document.getElementById("textoOferta");

let produtos = [];
let produtosFiltrados = [];

let pagina = 0;
const produtosPorPagina = 12;

//============================
// RELÓGIO
//============================

function atualizarRelogio(){

    const agora = new Date();

    document.getElementById("hora").innerHTML =
        agora.toLocaleTimeString("pt-BR");

    document.getElementById("data").innerHTML =
        agora.toLocaleDateString("pt-BR",
        {
            weekday:"long",
            day:"2-digit",
            month:"2-digit",
            year:"numeric"
        });

}

setInterval(atualizarRelogio,1000);

atualizarRelogio();


//============================
// LEITOR DO MGV
//============================

function lerLinha(linha){

    return {

        departamento : linha.substring(0,2),

        tipoVenda : linha.substring(2,3),

        ean : linha.substring(3,9),

        preco :
            Number(linha.substring(9,15))/100,

        validade :
            linha.substring(15,18),

        descricao :
            linha.substring(18,43).trim(),

        codigoExtra :
            linha.substring(43,49),

        naoUsado :
            linha.substring(49,53),

        nutricional :
            linha.substring(53,59),

        dataEmbalagem :
            linha.substring(59,60),

        dataValidade :
            linha.substring(60,61)

    };

}


//============================
// CARREGAR ARQUIVO
//============================

inputArquivo.addEventListener("change",(e)=>{

    const arquivo = e.target.files[0];

    if(!arquivo)
        return;

    const leitor = new FileReader();

    leitor.onload = function(ev){

        const linhas =
            ev.target.result.split(/\r?\n/);

        produtos=[];

        linhas.forEach(l=>{

            const p=lerLinha(l);

            if(p)
                produtos.push(p);

        });

        produtosFiltrados=[...produtos];

        totalProdutos.innerHTML=produtos.length;

        pagina=0;

        mostrarPagina();

        iniciarOferta();

    }

    leitor.readAsText(arquivo);

});


//============================
// MONTA CARD
//============================

function criarCard(prod){

    const ehOferta = prod.precoClube && prod.precoClube > 0;

    return `

    <div class="card ${ehOferta ? "oferta" : ""}">

        ${ehOferta ? '<div class="seloOferta">🔥 OFERTA</div>' : ''}

        <div class="descricao">

            ${prod.descricao}

        </div>

        <div class="preco">

            R$ ${prod.preco.toFixed(2).replace(".", ",")}

        </div>

        <div class="unidade">

            ${prod.tipoVenda === "0" ? "POR KG" : "POR UN"}

        </div>

        ${
            ehOferta
            ?
            `<div class="precoClube">

                Clube: R$ ${prod.precoClube.toFixed(2).replace(".", ",")}

            </div>`
            :
            ""
        }

    </div>

    `;

}

//============================
// PAGINAÇÃO
//============================

function mostrarPagina(){

    const inicio =
        pagina*produtosPorPagina;

    const fim =
        inicio+produtosPorPagina;

    const lista =
        produtosFiltrados.slice(inicio,fim);

    grid.innerHTML="";

    lista.forEach(prod=>{

        grid.innerHTML+=criarCard(prod);

    });

}


//============================
// BOTÕES
//============================

document
.getElementById("proximo")
.onclick=()=>{

    if((pagina+1)*produtosPorPagina
        <produtosFiltrados.length){

        pagina++;

        mostrarPagina();

    }

}

document
.getElementById("anterior")
.onclick=()=>{

    if(pagina>0){

        pagina--;

        mostrarPagina();

    }

}


//============================
// PESQUISA
//============================

pesquisa.addEventListener("keyup",()=>{

    const texto =
        pesquisa.value.toUpperCase();

    produtosFiltrados =
        produtos.filter(p=>

            p.descricao.toUpperCase().includes(texto)

            ||

            p.ean.includes(texto)

        );

    pagina=0;

    mostrarPagina();

});


//============================
// OFERTA
//============================

function iniciarOferta(){

    if(produtos.length===0)
        return;

    let indice=0;

    trocarOferta();

    setInterval(trocarOferta,5000);

    function trocarOferta(){

        if(indice>=produtos.length)
            indice=0;

        const p=produtos[indice];

        textoOferta.innerHTML=

            `🔥 OFERTA DO DIA • ${p.descricao} • R$ ${p.preco}`;

        indice++;

    }

}