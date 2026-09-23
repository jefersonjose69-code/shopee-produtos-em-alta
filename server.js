const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

let produtos = [
  {
    id: 1,
    nome: "Organizador de Gavetas MDF",
    preco: 51.90,
    categoria: "Casa",
    link: "",
    comissao: 0,
    destaque: true
  },
  {
    id: 2,
    nome: "Fone Bluetooth",
    preco: 39.90,
    categoria: "Eletrônicos",
    link: "",
    comissao: 0,
    destaque: true
  },
  {
    id: 3,
    nome: "Suporte para Celular",
    preco: 19.90,
    categoria: "Acessórios",
    link: "",
    comissao: 0,
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
    produtos
  });
});

app.post("/api/produtos", (req, res) => {

  const {
    nome,
    preco,
    categoria,
    link,
    comissao,
    destaque
  } = req.body;

  if (!nome || preco === undefined) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "Nome e preço são obrigatórios."
    });
  }

  const novoProduto = {
    id: Date.now(),
    nome: nome,
    preco: Number(preco),
    categoria: categoria || "Outros",
    link: link || "",
    comissao: Number(comissao || 0),
    destaque: Boolean(destaque)
  };

  produtos.push(novoProduto);

  res.status(201).json({
    sucesso: true,
    mensagem: "Produto adicionado com sucesso.",
    produto: novoProduto
  });
});

app.delete("/api/produtos/:id", (req, res) => {

  const id = Number(req.params.id);

  const quantidadeAntes = produtos.length;

  produtos = produtos.filter(produto => produto.id !== id);

  if (produtos.length === quantidadeAntes) {
    return res.status(404).json({
      sucesso: false,
      mensagem: "Produto não encontrado."
    });
  }

  res.json({
    sucesso: true,
    mensagem: "Produto excluído com sucesso."
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
