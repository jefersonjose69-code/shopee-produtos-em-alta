const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    sistema: "Shopee Produtos em Alta",
    status: "online",
    mensagem: "Servidor funcionando!"
  });
});

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
