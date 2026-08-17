const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 3000;

//==================================================
// CAMINHO DO FRONTEND
//==================================================

const pastaPublic = path.join(
    __dirname,
    "public"
);

//==================================================
// CAMINHO FIXO DO ARQUIVO MGV
//==================================================

const arquivoMGV =
    "C:\\Users\\walac\\OneDrive\\Desktop\\Visualizador MGV\\dados\\ITENSMGV.txt";

//==================================================
// FRONTEND
//==================================================

app.use(express.static(pastaPublic));

//==================================================
// API PRODUTOS
//==================================================

app.get("/api/produtos", (req, res) => {

    console.log("================================");
    console.log("Lendo arquivo MGV:");
    console.log(arquivoMGV);

    // Verifica se o arquivo existe
    if (!fs.existsSync(arquivoMGV)) {

        console.error(
            "ARQUIVO MGV NÃO ENCONTRADO!"
        );

        return res.status(500).json({

            erro:
                "Arquivo ITENSMGV.txt não encontrado.",

            caminho:
                arquivoMGV

        });

    }

    fs.readFile(
        arquivoMGV,
        "latin1",
        (erro, texto) => {

            if (erro) {

                console.error(
                    "Erro ao ler ITENSMGV:",
                    erro
                );

                return res.status(500).json({

                    erro: erro.message

                });

            }

            // Remove CR e separa as linhas
            const linhas = texto
                .replace(/\r/g, "")
                .split("\n")
                .filter(
                    linha =>
                        linha.trim() !== ""
                );

            const produtos = [];

            linhas.forEach(linha => {

                // Ignora linhas inválidas
                if (linha.length < 43) {

                    return;

                }

                //==================================================
                // CAMPOS MGV
                //==================================================

                const departamento =
                    linha.substring(0, 2);

                const tipoVenda =
                    linha.substring(2, 3);

                const ean =
                    linha.substring(3, 9);

                const preco =
                    Number(
                        linha.substring(9, 15)
                    ) / 100;

                const validade =
                    linha.substring(15, 18);

                const descricao =
                    linha
                        .substring(18, 43)
                        .trim();

                // Preço Clube
                const precoClube =
                    Number(
                        linha.substring(146, 152)
                    ) / 100;

                //==================================================
                // PRODUTO
                //==================================================

                produtos.push({

                    departamento:
                        departamento,

                    tipoVenda:
                        tipoVenda,

                    ean:
                        ean,

                    preco:
                        preco,

                    validade:
                        validade,

                    descricao:
                        descricao,

                    precoClube:
                        precoClube || 0

                });

            });

            console.log(
                "Produtos carregados:",
                produtos.length
            );

            console.log("================================");

            res.json(produtos);

        }

    );

});

//==================================================
// SERVIDOR
//==================================================

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            "================================"
        );

        console.log(
            "      VISUALIZADOR MGV"
        );

        console.log(
            "================================"
        );

        console.log(
            "Servidor iniciado"
        );

        console.log(
            "Porta:",
            PORT
        );

        console.log(
            "Local:"
        );

        console.log(
            "http://localhost:" + PORT
        );

        console.log(
            "Arquivo MGV:"
        );

        console.log(
            arquivoMGV
        );

        console.log(
            "================================"
        );

    }
);