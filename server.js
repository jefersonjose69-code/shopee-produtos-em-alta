const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const db = new sqlite3.Database("./produtos.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      preco REAL NOT NULL,
      categoria TEXT DEFAULT 'Outros',
      link TEXT DEFAULT '',
      imagem TEXT DEFAULT '',
      comissao REAL DEFAULT 0,
      destaque INTEGER DEFAULT 0
    )
  `);

  db.get("SELECT COUNT(*) AS total FROM produtos", (erro, resultado) => {
    if (erro) {
      console.error("Erro ao verificar produtos:", erro);
      return;
    }

    if (resultado.total === 0) {
      const produtosIniciais = [
        [
          "Organizador de Gavetas MDF",
          51.90,
          "Casa",
          "",
          "",
          0,
          1
        ],
        [
          "Fone Bluetooth",
          39.90,
          "Eletrônicos",
          "",
          "",
          0,
          1
        ],
        [
          "Suporte para Celular",
          19.90,
          "Acessórios",
          "",
          "",
          0,
          1
        ]
      ];

      const inserir = db.prepare(`
        INSERT INTO produtos
        (nome, preco, categoria, link, imagem, comissao, destaque)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      produtosIniciais.forEach(produto => {
        inserir.run(produto);
      });

      inserir.finalize();
    }
  });
});


app.get("/api/status", (req, res) => {
  res.json({
    sucesso: true,
    servidor: "online",
    mensagem: "Servidor funcionando corretamente"
  });
});


app.get("/api/produtos", (req, res) => {

  db.all(
    "SELECT * FROM produtos ORDER BY id DESC",
    [],
    (erro, produtos) => {

      if (erro) {
        console.error(erro);

        return res.status(500).json({
          sucesso: false,
          mensagem: "Erro ao carregar produtos."
        });
      }

      res.json({
        sucesso: true,
        total: produtos.length,
        produtos
      });
    }
  );
});


app.post("/api/produtos", (req, res) => {

  const {
    nome,
    preco,
    categoria,
    link,
    imagem,
    comissao,
    destaque
  } = req.body;

  if (!nome || preco === undefined) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "Nome e preço são obrigatórios."
    });
  }

  const sql = `
    INSERT INTO produtos
    (nome, preco, categoria, link, imagem, comissao, destaque)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      nome,
      Number(preco),
      categoria || "Outros",
      link || "",
      imagem || "",
      Number(comissao || 0),
      destaque ? 1 : 0
    ],
    function (erro) {

      if (erro) {
        console.error(erro);

        return res.status(500).json({
          sucesso: false,
          mensagem: "Erro ao adicionar produto."
        });
      }

      res.status(201).json({
        sucesso: true,
        mensagem: "Produto adicionado com sucesso.",
        produto: {
          id: this.lastID,
          nome,
          preco: Number(preco),
          categoria: categoria || "Outros",
          link: link || "",
          imagem: imagem || "",
          comissao: Number(comissao || 0),
          destaque: Boolean(destaque)
        }
      });
    }
  );
});


app.delete("/api/produtos/:id", (req, res) => {

  const id = Number(req.params.id);

  db.run(
    "DELETE FROM produtos WHERE id = ?",
    [id],
    function (erro) {

      if (erro) {
        console.error(erro);

        return res.status(500).json({
          sucesso: false,
          mensagem: "Erro ao excluir produto."
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Produto não encontrado."
        });
      }

      res.json({
        sucesso: true,
        mensagem: "Produto excluído com sucesso."
      });
    }
  );
});


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
