const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 3000;

const arquivoMGV = path.join(__dirname, "dados", "ITENSMGV.txt");

app.use(express.static("public"));

app.get("/api/produtos", (req, res) => {

    fs.readFile(arquivoMGV, "latin1", (erro, texto) => {

        if (erro) {

            return res.status(500).json({
                erro: erro.message
            });

        }

        const linhas = texto
            .replace(/\r/g, "")
            .split("\n")
            .filter(l => l.trim() !== "");

        const produtos = [];

        linhas.forEach(linha => {

            produtos.push({

                departamento: linha.substring(0,2),

                tipoVenda: linha.substring(2,3),

                ean: linha.substring(3,9),

                preco: Number(linha.substring(9,15))/100,

                validade: linha.substring(15,18),

                descricao: linha.substring(18,43).trim(),

                precoClube:
                    Number(linha.substring(146,152))/100 || 0

            });

        });

        res.json(produtos);

    });

});

app.listen(PORT,"0.0.0.0",()=>{

    console.log("Servidor iniciado");

    console.log("http://localhost:"+PORT);

});