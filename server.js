const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Permite abrir o painel pelo navegador
app.use(express.static(__dirname));

app.get("/api/status", (req, res) => {
  res.json({
    online: true,
    sistema: "Shopee Produtos em Alta"
  });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
