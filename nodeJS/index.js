const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Configuração da conexão com o banco de dados
const db = mysql.createConnection({
  host: 'localhost', // Nome do host (pode ser 'mysql' se estiver no Docker Compose)
  user: 'user',      // Usuário configurado no Docker Compose
  password: 'password', // Senha configurada no Docker Compose
  database: 'crud_db' // Nome do banco de dados
});

// Conectando ao banco de dados
db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conexão com o banco de dados bem-sucedida!');
  }
});

// Rota para inserir um usuário no banco de dados
app.get('/add-user', (req, res) => {
  console.log(req.query);
  const { name, email } = req.query; // Pegando os valores das query strings
  if (!name || !email) {
    res.status(400).json({ success: false, message: 'Nome e email são obrigatórios.' });
    return;
  }

  const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
  db.query(query, [name, email], (err, results) => {
    if (err) {
      console.error('Erro ao inserir usuário:', err);
      res.status(500).json({ success: false, message: 'Erro ao inserir usuário no banco de dados.' });
      return;
    }

    res.json({
      success: true,
      message: 'Usuário adicionado com sucesso!',
      user: { name, email }
    });
  });
});

// Rota para exibir todos os usuários
app.get('/', (req, res) => {
  const query = 'SELECT * FROM users'; // Nome correto da tabela
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro na consulta:', err);
      res.status(500).json({ success: false, message: 'Erro na consulta ao banco de dados.' });
      return;
    }

    res.json({
      success: true,
      users: results
    });
  });
});

// Inicializa o servidor
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
