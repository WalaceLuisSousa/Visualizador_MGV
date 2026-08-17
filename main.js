const { app, BrowserWindow } = require("electron");
const http = require("http");

let janela = null;

const PORTA = 3000;


//==================================================
// INICIAR SERVIDOR EXPRESS
//==================================================

function iniciarServidor(){

    console.log("Iniciando servidor Express...");

    try{

        require("./server.js");

        console.log("server.js carregado.");

    }
    catch(erro){

        console.error(
            "Erro ao iniciar server.js:",
            erro
        );

    }

}


//==================================================
// ESPERAR SERVIDOR
//==================================================

function esperarServidor(){

    return new Promise((resolve)=>{

        let tentativas = 0;

        const verificar = ()=>{

            tentativas++;

            const requisicao = http.get(

                `http://127.0.0.1:${PORTA}`,

                resposta=>{

                    console.log(
                        "Servidor Express está pronto."
                    );

                    resposta.resume();

                    resolve();

                }

            );

            requisicao.on("error",()=>{

                if(tentativas > 30){

                    console.error(
                        "Servidor não respondeu."
                    );

                    resolve();

                    return;

                }

                console.log(
                    "Aguardando servidor..."
                );

                setTimeout(
                    verificar,
                    500
                );

            });

            requisicao.setTimeout(
                500,
                ()=>{
                    requisicao.destroy();
                }
            );

        };

        verificar();

    });

}


//==================================================
// CRIAR JANELA
//==================================================

function criarJanela(){

    janela = new BrowserWindow({

        width:1920,

        height:1080,

        fullscreen:true,

        kiosk:true,

        autoHideMenuBar:true,

        backgroundColor:"#10151d",

        webPreferences:{

            contextIsolation:true,

            nodeIntegration:false

        }

    });


    janela.loadURL(

        `http://127.0.0.1:${PORTA}`

    );


    janela.webContents.on(
        "did-fail-load",
        (evento, codigo, descricao)=>{

            console.error(
                "Erro ao carregar:",
                codigo,
                descricao
            );

        }
    );


    janela.on("closed",()=>{

        janela = null;

    });

}


//==================================================
// INICIAR APLICAÇÃO
//==================================================

app.whenReady().then(async()=>{

    console.log(
        "Visualizador MGV iniciado."
    );

    iniciarServidor();

    await esperarServidor();

    criarJanela();

});


//==================================================
// FECHAR
//==================================================

app.on("window-all-closed",()=>{

    if(process.platform !== "darwin"){

        app.quit();

    }

});