const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const produtos = [
  {
    id: 1,
    nome: "Organizador de Gavetas MDF",
    preco: 51.90,
    categoria: "Casa",
    destaque: true
  },
  {
    id: 2,
    nome: "Fone Bluetooth",
    preco: 39.90,
    categoria: "Eletrônicos",
    destaque: true
  },
  {
    id: 3,
    nome: "Suporte para Celular",
    preco: 19.90,
    categoria: "Acessórios",
    destaque: true
  }
];

app.get("/api/status", (req, res) => {
  res.json({
    sucesso: true,
    servidor: "online",
    mensagem: "Servidor funcionando corretamente"
  });
});

app.get("/api/produtos", (req, res) => {
  res.json({
    sucesso: true,
    total: produtos.length,
    produtos: produtos
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
