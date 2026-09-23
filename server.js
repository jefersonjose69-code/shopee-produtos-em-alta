const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

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
    produtos: []
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
