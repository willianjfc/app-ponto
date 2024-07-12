const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { google } = require('googleapis');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurando CORS para permitir requisições do frontend (exemplo: http://127.0.0.1:8080)
app.use(cors({
  origin: 'http://127.0.0.1:8080',  // Substitua pelo endereço do seu frontend
}));

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: SCOPES,
});
const sheets = google.sheets({ version: 'v4', auth });

app.post('/batida', async (req, res) => {
  const { nome, dataHora, latitude, longitude } = req.body;
  console.log('Dados recebidos:', { nome, dataHora, latitude, longitude });

  try {
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const range = 'Página1!A:D';

    const values = [[nome, dataHora, latitude, longitude]];
    const resource = { values };

    console.log('Iniciando requisição para Google Sheets API...');

    const result = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      resource,
    });

    console.log('Resultado da API:', result.data);
    res.status(200).send('Batida registrada com sucesso!');
  } catch (error) {
    console.error('Erro ao registrar a batida:', error.message);
    res.status(500).send('Erro ao registrar a batida');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
