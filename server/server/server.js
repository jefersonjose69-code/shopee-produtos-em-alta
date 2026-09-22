const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Mostra o painel do sistema
app.use(express.static(__dirname));

app.get("/api/status", (req, res) => {
  res.json({
    online: true,
    sistema: "Shopee Produtos em Alta"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
